import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { PermissionService } from '../../service/register/PermissionService';
import { Toolbar } from 'primereact/toolbar';

const Permission = () => {

    let permissionNew = {
        name: ''
    };

    const [permissions, setPermissions] = useState(null);
    const [permissionDialog, setPermissionDialog] = useState(null);
    const [permissionDeleteDialog, setPermissionDeleteDialog] = useState(false);
    const [permission, setPermission] = useState(permissionNew);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const permissionService = new PermissionService();

    useEffect(() => {
        if (permissions == null){
            permissionService.permission().then(res => {
                setPermissions(res.data)
            });
        }
    }, [permissions, permissionService]);

    const openNew = () => {
        setPermission(permissionNew);
        setSubmitted(false);
        setPermissionDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setPermissionDialog(false);
    }

    const hideDeletePermissionDialog = () => {
        setPermissionDeleteDialog(false);
    }

    const savePermission = () => {
        setSubmitted(true);

        if(permission.name.trim()){
            let _permission = { ...permission};
            if(permission.id){
                permissionService.alter(_permission).then(data => {
                    toast.current.show({severity: 'sucess', summary: 'Successful', detail: 'Product Updated', life: 3000 })
                    setPermissions(null);
                    });
            }else{
                permissionService.insert(_permission).then(data => {
                    toast.current.show({severity: 'sucess', summary: 'Successful', detail: 'Product Created', life: 3000 })
                    setPermissions(null)
                });
            }
            setPermissionDialog(false);
            setPermission(permissionNew);
        }
    }

    const editPermission = (permission) => {
        setPermission({ ...permission});
        setPermissionDialog(true);
    }

    const confirmDeletePermission = (permission) => {
        setPermission(permission);
        setPermissionDeleteDialog(true);
    }

    const deletePermission = () => {
        permissionService.delete(permission.id).then(data => {
            toast.current.show({severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});

            setPermissions(null);
            setPermissionDeleteDialog(false);
        });
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _permission = { ...permission};
        _permission[`${name}`] = val;

        setPermission(_permission);
    }

    const leftToolbarTemplate = () => {
        return(
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nova Permissão" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editPermission(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeletePermission(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className='m-0'>Permissões Cadastradas</h5>
            <span className='block mt-2 md:mt-0 p-input-icon-left'>
                <i className='pi pi-search'/>
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const permissionDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" className="p-button-text" onClick={savePermission} />
        </>
    );
    const deletePermissionDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" className="p-button-text" onClick={hideDeletePermissionDialog} />
            <Button label="Sim" icon="pi pi-check" className="p-button-text" onClick={deletePermission} />
        </>
    );

    return(
        <div className="grid table-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={permissions}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={globalFilter} emptyMessage="No products found." header={header} responsiveLayout="scroll">
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem'}}></Column>
                        <Column field="id" header="ID" sortable body={idBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="name" header="Nome" sortable body={nameBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={permissionDialog} style={{ width: '450px' }} header="Detalhes da Marca" modal className="p-fluid" footer={permissionDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Nome</label>
                            <InputText id="name" value={permission.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !permission.name })} />
                            {submitted && !permission.name && <small className="p-invalid">Nome é obrigatório.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={permissionDeleteDialog} style={{ width: '450px' }} header="Confirmação" modal footer={deletePermissionDialogFooter} onHide={hideDeletePermissionDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {permission && <span>Deseja excluir a Marca <b>{permission.name}</b>?</span>}
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

export default React.memo(Permission, comparisonFn);

