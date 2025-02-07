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
import { MarkService } from '../../service/register/MarkService';

const Mark = () => {

    let markNew = {
        name: ''
    };

    const [marks, setMarks] = useState(null);
    const [markDialog, setMarkDialog] = useState(null);
    const [markDeleteDialog, setMarkDeleteDialog] = useState(false);
    const [mark, setMark] = useState(markNew);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const markService = new MarkService();

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: mark,

        validate: (data) => {
            let errors = {};
        
            if (!data.name) {
                errors.name = "Nome é obrigatório.";
            }
        
            return errors;
        },
        onSubmit: (data) => {
            setMark(data);
            saveMark();
            formik.resetForm();
        }
    });

    useEffect(() => {
        if (marks == null){
            markService.mark().then(res => {
                setMarks(res.data)
            });
        }
    }, [marks, markService]);

    const openNew = () => {
        setMark(markNew);
        setSubmitted(false);
        setMarkDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setMarkDialog(false);
    }

    const hideDeleteMarkDialog = () => {
        setMarkDeleteDialog(false);
    }

    const saveMark = () => {
        setSubmitted(true);

        if(mark.name.trim()){
            let _mark = formik.values;
            if(mark.id){
                markService.alter(_mark).then(data => {
                    toast.current.show({severity: 'sucess', summary: 'Successful', detail: 'Product Updated', life: 3000 })
                    setMarks(null);
                    });
            }else{
                markService.insert(_mark).then(data => {
                    toast.current.show({severity: 'sucess', summary: 'Successful', detail: 'Product Created', life: 3000 })
                    setMarks(null)
                });
            }
            setMarkDialog(false);
            setMark(markNew);
        }
    }

    const editMark = (mark) => {
        setMark({ ...mark});
        setMarkDialog(true);
    }

    const confirmDeleteMark = (mark) => {
        setMark(mark);
        setMarkDeleteDialog(true);
    }

    const deleteMark = () => {
        markService.delete(mark.id).then(data => {
            toast.current.show({severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});

            setMarks(null);
            setMarkDeleteDialog(false);
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
                    <Button label="Nova Marca" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editMark(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteMark(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className='m-0'>Marcas Cadastradas</h5>
            <span className='block mt-2 md:mt-0 p-input-icon-left'>
                <i className='pi pi-search'/>
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const markDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button type="submit" form="formMark" label="Salvar" icon="pi pi-check" className="p-button-text" />
        </>
    );
    const deleteMarkDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" className="p-button-text" onClick={hideDeleteMarkDialog} />
            <Button label="Sim" icon="pi pi-check" className="p-button-text" onClick={deleteMark} />
        </>
    );

    return(
        <div className="grid table-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={marks}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={globalFilter} emptyMessage="No products found." header={header} responsiveLayout="scroll">
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem'}}></Column>
                        <Column field="id" header="ID" sortable body={idBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="name" header="Nome" sortable body={nameBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={markDialog} style={{ width: '450px' }} header="Detalhes da Marca" modal className="p-fluid" footer={markDialogFooter} onHide={hideDialog}>
                        <form id="formMark" onSubmit={formik.handleSubmit}>
                            <div className="field">
                                <label htmlFor="name">Nome</label>
                                <InputText id="name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('name') })} />
                                {getFormErrorMessage('name')}
                            </div>
                        </form>
                    </Dialog>

                    <Dialog visible={markDeleteDialog} style={{ width: '450px' }} header="Confirmação" modal footer={deleteMarkDialogFooter} onHide={hideDeleteMarkDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {mark && <span>Deseja excluir a Marca <b>{mark.name}</b>?</span>}
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

export default React.memo(Mark, comparisonFn);
