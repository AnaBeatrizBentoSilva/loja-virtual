import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import {useFormik} from 'formik';
import { CategoryService } from '../../service/register/CategoryService';

const Category = () => {

    let categoryNew = {
        name: ''
    };

    const [categories, setCategories] = useState(null);
    const [categoryDialog, setCategoryDialog] = useState(null);
    const [categoryDeleteDialog, setCategoryDeleteDialog] = useState(false);
    const [category, setCategory] = useState(categoryNew);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const categoryService = new CategoryService();

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: category,

        validate: (data) => {
            let errors = {};
        
            if (!data.name) {
                errors.name = "Nome é obrigatório.";
            }
        
            return errors;
        },
        onSubmit: (data) => {
            setCategory(data);
            saveCategory();
            formik.resetForm();
        }
    });

    useEffect(() => {
        if (categories == null){
            categoryService.category().then(res => {
                setCategories(res.data)
            });
        }
    }, [categories, categoryService]);

    const openNew = () => {
        setCategory(categoryNew);
        setSubmitted(false);
        setCategoryDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setCategoryDialog(false);
    }

    const hideDeleteCategoryDialog = () => {
        setCategoryDeleteDialog(false);
    }

    const saveCategory = () => {
        setSubmitted(true);

        if(category.name.trim()){
            let _category = formik.values;
            if(category.id){
                categoryService.alter(_category).then(data => {
                    toast.current.show({severity: 'sucess', summary: 'Successful', detail: 'Product Updated', life: 3000 })
                    setCategories(null);
                    });
            }else{
                categoryService.insert(_category).then(data => {
                    toast.current.show({severity: 'sucess', summary: 'Successful', detail: 'Product Created', life: 3000 })
                    setCategories(null)
                });
            }
            setCategoryDialog(false);
            setCategory(categoryNew);
        }
    }

    const editCategory = (category) => {
        setCategory({ ...category});
        setCategoryDialog(true);
    }

    const confirmDeleteCategory = (category) => {
        setCategory(category);
        setCategoryDeleteDialog(true);
    }

    const deleteCategory = () => {
        categoryService.delete(category.id).then(data => {
            toast.current.show({severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});

            setCategories(null);
            setCategoryDeleteDialog(false);
        });
    }

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    }

    const leftToolbarTemplate = () => {
        return(
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nova Categoria" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                </div>
            </React.Fragment>
        );
    }

    const idBodyTemplate = (rowData) => {
        return(
            <>
                <span className="p-column-title">ID</span>
                {rowData.id}
            </>
        );
    }

    const nameBodyTemplate = (rowData) => {
        return(
            <>
                <span className='p-column-title'>Nome</span>
                {rowData.name}
            </>
        );
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editCategory(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteCategory(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className='m-0'>Categorias Cadastradas</h5>
            <span className='block mt-2 md:mt-0 p-input-icon-left'>
                <i className='pi pi-search'/>
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const categoryDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button type="submit" form="formCategory" label="Salvar" icon="pi pi-check" className="p-button-text" />
        </>
    );
    const deleteCategoryDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" className="p-button-text" onClick={hideDeleteCategoryDialog} />
            <Button label="Sim" icon="pi pi-check" className="p-button-text" onClick={deleteCategory} />
        </>
    );

    return(
        <div className="grid table-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={categories}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={globalFilter} emptyMessage="No products found." header={header} responsiveLayout="scroll">
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem'}}></Column>
                        <Column field="id" header="ID" sortable body={idBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="name" header="Nome" sortable body={nameBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={categoryDialog} style={{ width: '450px' }} header="Detalhes da Categoria" modal className="p-fluid" footer={categoryDialogFooter} onHide={hideDialog}>
                        <form id="formCategory" onSubmit={formik.handleSubmit}>
                            <div className="field">
                                <label htmlFor="name">Nome</label>
                                <InputText id="name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('name') })} />
                                {getFormErrorMessage('name')}                            
                            </div>
                        </form>
                    </Dialog>

                    <Dialog visible={categoryDeleteDialog} style={{ width: '450px' }} header="Confirmação" modal footer={deleteCategoryDialogFooter} onHide={hideDeleteCategoryDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {category && <span>Deseja excluir a Categoria <b>{category.name}</b>?</span>}
                        </div>
                    </Dialog>

                </div>
            </div>
        </div>
    );
}

const comparisonFn = function (prevProps, nextProps){
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Category, comparisonFn);
