import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import {useFormik} from 'formik';
import { ProductService } from '../../service/register/ProductService';
import { CategoryService } from '../../service/register/CategoryService';
import { MarkService } from '../../service/register/MarkService';

const Product = () => {

    let productNew = {
        shortDescription: '',
        detailedDescription: '',
        costValue: '',
        saleValue: '',
        category: null,
        mark: null
    };

    const [products, setProducts] = useState(null);
    const [categories, setCategories] = useState(null);
    const [marks, setMarks] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [productDeleteDialog, setProductDeleteDialog] = useState(false);
    const [product, setProduct] = useState(productNew);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const productService = new ProductService();
    const categoryService = new CategoryService();
    const markService = new MarkService();

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: product,

        validate: (data) => {
            let errors = {};
        
            if (!data.shortDescription) {
                errors.shortDescription = "Descrição curta é obrigatória.";
            }
        
            if (!data.costValue) {
                errors.costValue = "Valor de custo é obrigatório.";
            } 

            if (!data.saleValue) {
                errors.saleValue = "Valor de venda é obrigatório.";
            } 
        
            return errors;
        },
        onSubmit: (data) => {
            setProduct(data);
            saveProduct();
            formik.resetForm();
        }
    });

    useEffect(() => {
        categoryService.category().then((res) => {
            const formattedCategories = res.data.map((category) => ({
                label: `${category.name}`,
                value: category,
            }));
            setCategories(formattedCategories);
        });
    }, [categoryService]);

    useEffect(() => {
        markService.mark().then((res) => {
            const formattedMarks = res.data.map((mark) => ({
                label: `${mark.name}`,
                value: mark,
            }));
            setMarks(formattedMarks);
        });
    }, [markService]);

    useEffect(() => {
        if (products == null) {
            productService.product().then(res => {
                setProducts(res.data);
            });
        }
    }, [products, productService]);

    const openNew = () => {
        setProduct(productNew);
        setSubmitted(false);
        setProductDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    }

    const hideDeleteProductDialog = () => {
        setProductDeleteDialog(false);
    }

    const saveProduct = () => {
        setSubmitted(true);

        if(product.shortDescription.trim()){
            let _product = formik.values;
            if(product.id){
                productService.alter(_product).then(data => {
                    toast.current.show({severity: 'sucess', summary: 'Successful', detail: 'Product Updated', life: 3000 })
                    setProducts(null);
                    });
            }else{
                productService.insert(_product).then(data => {
                    toast.current.show({severity: 'sucess', summary: 'Successful', detail: 'Product Created', life: 3000 })
                    setProducts(null)
                });
            }
            setProductDialog(false);
            setProduct(productNew);
        }
    }

    const editProduct = (product) => {
        setProduct({ ...product});
        setProductDialog(true);
    }

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setProductDeleteDialog(true);
    }

    const deleteProduct = () => {
        productService.delete(product.id).then(data => {
            toast.current.show({severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
            setProducts(null);
            setProductDeleteDialog(false);
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
                    <Button label="Novo Produto" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
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

    const shortDescriptionBodyTemplate = (rowData) => {
        return(
            <>
                <span className='p-column-title'>Descrição curta</span>
                {rowData.shortDescription}
            </>
        );
    }

    const detailedDescriptionBodyTemplate = (rowData) => {
        return(
            <>
                <span className='p-column-title'>Descrição detalhada</span>
                {rowData.detailedDescription}
            </>
        );
    }

    const costValueBodyTemplate = (rowData) => {
        return(
            <>
                <span className='p-column-title'>Valor de custo</span>
                {rowData.costValue}
            </>
        );
    }

    const saleValueBodyTemplate = (rowData) => {
        return(
            <>
                <span className='p-column-title'>Valor de venda</span>
                {rowData.saleValue}
            </>
        );
    }

    const categoryBodyTemplate = (rowData) => {
        return(
            <>
                <span className='p-column-title'>Categoria</span>
                {rowData.category && (rowData.category.name)}
            </>
        );
    }

    const markBodyTemplate = (rowData) => {
        return(
            <>
                <span className='p-column-title'>Marca</span>
                {rowData.mark && (rowData.mark.name)}
            </>
        );
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteProduct(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className='m-0'>Produtos Cadastrados</h5>
            <span className='block mt-2 md:mt-0 p-input-icon-left'>
                <i className='pi pi-search'/>
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button type="submit" form="formProduct" label="Salvar" icon="pi pi-check" className="p-button-text" />
        </>
    );

    const deleteProductDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Sim" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </>
    );

    return (
        <div className="grid table-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
    
                    <DataTable ref={dt} value={products}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={globalFilter} emptyMessage="No products found." header={header} responsiveLayout="scroll">
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                        <Column field="id" header="ID" sortable body={idBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="shortDescription" header="Descrição Curta" sortable body={shortDescriptionBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="detailedDescription" header="Descrição Detalhada" sortable body={detailedDescriptionBodyTemplate} headerStyle={{ width: '20%', minWidth: '15rem' }}></Column>
                        <Column field="costValue" header="Valor de Custo" sortable body={costValueBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="saleValue" header="Valor de Venda" sortable body={saleValueBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="category" header="Categoria" sortable body={categoryBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="mark" header="Marca" sortable body={markBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>
    
                    <Dialog visible={productDialog} style={{ width: '450px' }} header="Detalhes do Produto" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <form id="formProduct" onSubmit={formik.handleSubmit}>
                            <div className="field">
                                <label htmlFor="shortDescription">Descrição Curta*</label>
                                <InputText id="shortDescription" value={formik.values.shortDescription} onChange={formik.handleChange} onBlur={formik.handleBlur} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('shortDescription') })} />
                                {getFormErrorMessage('shortDescription')}
                            </div>
        
                            <div className="field">
                                <label htmlFor="detailedDescription">Descrição Detalhada</label>
                                <InputText id="detailedDescription" value={formik.values.detailedDescription} onChange={formik.handleChange} />
                            </div>
        
                            <div className="field">
                                <label htmlFor="costValue">Valor de Custo*</label>
                                <InputNumber id="costValue" value={formik.values.costValue} mode="currency" currency="BRL" locale="pt-BR" onBlur={formik.handleBlur} onValueChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('costValue') })} />
                                {getFormErrorMessage('costValue')}
                            </div>
        
                            <div className="field">
                                <label htmlFor="saleValue">Valor de Venda*</label>
                                <InputNumber id="saleValue" value={formik.values.saleValue} mode="currency" currency="BRL" locale="pt-BR" onBlur={formik.handleBlur} onValueChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('saleValue') })} />                            
                                {getFormErrorMessage('saleValue')}
                            </div>
        
                            <div className="field">
                                <label htmlFor="category">Categoria</label>
                                <Dropdown id="category" value={formik.values.category} filter onChange={formik.handleChange} options={categories} placeholder="Selecione a Categoria" />
                            </div>
        
                            <div className="field">
                                <label htmlFor="mark">Marca</label>
                                <Dropdown id="mark" value={formik.values.mark} filter onChange={formik.handleChange} options={marks} placeholder="Selecione a Marca" />
                            </div>
                        </form>
                    </Dialog>
    
                    <Dialog visible={productDeleteDialog} style={{ width: '450px' }} header="Confirmação" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && <span>Deseja excluir o produto <b>{product.shortDescription}</b>?</span>}
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

export default React.memo(Product, comparisonFn);