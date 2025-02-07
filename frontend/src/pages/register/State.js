import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import {useFormik} from 'formik';
import { StateService } from '../../service/register/StateService';

const State = () => {

    let stateNew = {
        name: '',
        acronym: ''
    };

    const [states, setStates] = useState(null);
    const [stateDialog, setStateDialog] = useState(null);
    const [stateDeleteDialog, setStateDeleteDialog] = useState(false);
    const [state, setState] = useState(stateNew);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const stateService = new StateService();

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: state,

        validate: (data) => {
            let errors = {};
        
            if (!data.name) {
                errors.name = "Nome é obrigatório.";
            }
        
            if (!data.acronym) {
                errors.acronym = "Sigla é obrigatória.";
            }
        
            return errors;
        },
        onSubmit: (data) => {
            setState(data);
            saveState();
            formik.resetForm();
        }
    });

    useEffect(() => {
        if (states == null){
            stateService.state().then(res => {
                setStates(res.data)
            });
        }
    }, [states, stateService]);

    const openNew = () => {
        setState(stateNew);
        setSubmitted(false);
        setStateDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setStateDialog(false);
    }

    const hideDeleteStateDialog = () => {
        setStateDeleteDialog(false);
    }

    const saveState = () => {
        setSubmitted(true);

        if(state.name.trim()){
            let _state = formik.values;
            if(state.id){
                stateService.alter(_state).then(data => {
                    toast.current.show({severity: 'sucess', summary: 'Successful', detail: 'Product Updated', life: 3000 })
                    setStates(null);
                    });
            }else{
                stateService.insert(_state).then(data => {
                    toast.current.show({severity: 'sucess', summary: 'Successful', detail: 'Product Created', life: 3000 })
                    setStates(null)
                });
            }
            setStateDialog(false);
            setState(stateNew);
        }
    }

    const editState = (state) => {
        setState({ ...state});
        setStateDialog(true);
    }

    const confirmDeleteState = (state) => {
        setState(state);
        setStateDeleteDialog(true);
    }

    const deleteState = () => {
        stateService.delete(state.id).then(data => {
            toast.current.show({severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});

            setStates(null);
            setStateDeleteDialog(false);
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
                    <Button label="Novo Estado" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
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

    const acronymBodyTemplate = (rowData) => {
        return(
            <>
                <span className='p-column-title'>Sigla</span>
                {rowData.acronym}
            </>
        );
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editState(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteState(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className='m-0'>Estados Cadastrados</h5>
            <span className='block mt-2 md:mt-0 p-input-icon-left'>
                <i className='pi pi-search'/>
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const stateDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button type="submit" form="formState" label="Salvar" icon="pi pi-check" className="p-button-text" />
        </>
    );
    const deleteStateDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" className="p-button-text" onClick={hideDeleteStateDialog} />
            <Button label="Sim" icon="pi pi-check" className="p-button-text" onClick={deleteState} />
        </>
    );

    return(
        <div className="grid table-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={states}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={globalFilter} emptyMessage="No products found." header={header} responsiveLayout="scroll">
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem'}}></Column>
                        <Column field="id" header="ID" sortable body={idBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="name" header="Nome" sortable body={nameBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="acronym" header="Sigla" body={acronymBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={stateDialog} style={{ width: '450px' }} header="Detalhes do Estado" modal className="p-fluid" footer={stateDialogFooter} onHide={hideDialog}>
                        <form id="formState" onSubmit={formik.handleSubmit}>
                            <div className="field">
                                <label htmlFor="name">Nome</label>
                                <InputText id="name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('name') })} />
                                {getFormErrorMessage('name')}
                            </div>
                            <div className="field">
                                <label htmlFor="acronym">Sigla</label>
                                <InputTextarea id="acronym" value={formik.values.acronym} onChange={formik.handleChange} onBlur={formik.handleBlur} rows={3} cols={20} className={classNames({ 'p-invalid': isFormFieldValid('acronym') })}/>
                                {getFormErrorMessage('acronym')}
                            </div>
                        </form>
                    </Dialog>

                    <Dialog visible={stateDeleteDialog} style={{ width: '450px' }} header="Confirmação" modal footer={deleteStateDialogFooter} onHide={hideDeleteStateDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {state && <span>Deseja excluir o Estado de <b>{state.name}</b>?</span>}
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

export default React.memo(State, comparisonFn);
