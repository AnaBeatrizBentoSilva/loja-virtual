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
import {useFormik} from 'formik';
import { CityService } from '../../service/register/CityService';
import { StateService} from '../../service/register/StateService';

const City = () => {

    let cityNew = {
        name: '',
        state: null
    };

    const [cities, setCities] = useState(null);
    const [states, setStates] = useState(null);
    const [cityDialog, setCityDialog] = useState(false);
    const [cityDeleteDialog, setCityDeleteDialog] = useState(false);
    const [city, setCity] = useState(cityNew);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const cityService = new CityService();
    const stateService = new StateService();

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: city,

        validate: (data) => {
            let errors = {};
        
            if (!data.name) {
                errors.name = "Nome é obrigatório.";
            }
        
            return errors;
        },
        onSubmit: (data) => {
            setCity(data);
            saveCity();
            formik.resetForm();
        }
    });

    useEffect(() => {
        stateService.state().then((res) => {
            const formattedStates = res.data.map((state) => ({
                label: `${state.name} (${state.acronym})`,
                value: state,
            }));
            setStates(formattedStates);
        });
    }, [stateService]);
    
    
    useEffect(() => {
        if (cities == null) {
            cityService.city().then(res => {
                setCities(res.data);
            });
        }
    }, [cities, cityService]);
    

    const openNew = () => {
        setCity(cityNew);
        setSubmitted(false);
        setCityDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setCityDialog(false);
    }

    const hideDeleteCityDialog = () => {
        setCityDeleteDialog(false);
    }

    const saveCity = () => {
        setSubmitted(true);

        if(city.name.trim()){
            let _city = formik.values;
            if(city.id){
                cityService.alter(_city).then(data => {
                    toast.current.show({severity: 'sucess', summary: 'Successful', detail: 'Product Updated', life: 3000 })
                    setCities(null);
                    });
            }else{
                cityService.insert(_city).then(data => {
                    toast.current.show({severity: 'sucess', summary: 'Successful', detail: 'Product Created', life: 3000 })
                    setCities(null)
                });
            }
            setCityDialog(false);
            setCity(cityNew);
        }
    }

    const editCity = (city) => {
        setCity({ ...city});
        setCityDialog(true);
    }

    const confirmDeleteCity = (city) => {
        setCity(city);
        setCityDeleteDialog(true);
    }

    const deleteCity = () => {
        cityService.delete(city.id).then(data => {
            toast.current.show({severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});

            setCities(null);
            setCityDeleteDialog(false);
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
                    <Button label="Nova Cidade" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
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

    const stateBodyTemplate = (rowData) => {
        return(
            <>
                <span className='p-column-title'>Estado</span>
                {rowData.state && (rowData.state.name+'/'+rowData.state.acronym)}
            </>
        );
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editCity(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteCity(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className='m-0'>Cidades Cadastradas</h5>
            <span className='block mt-2 md:mt-0 p-input-icon-left'>
                <i className='pi pi-search'/>
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const cityDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button type="submit" form="formCity" label="Salvar" icon="pi pi-check" className="p-button-text" />
        </>
    );
    const deleteCityDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" className="p-button-text" onClick={hideDeleteCityDialog} />
            <Button label="Sim" icon="pi pi-check" className="p-button-text" onClick={deleteCity} />
        </>
    );

    return(
        <div className="grid table-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={cities}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={globalFilter} emptyMessage="No products found." header={header} responsiveLayout="scroll">
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem'}}></Column>
                        <Column field="id" header="ID" sortable body={idBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="name" header="Nome" sortable body={nameBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="state" header="Estado" sortable body={stateBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={cityDialog} style={{ width: '450px' }} header="Detalhes da Cidade" modal className="p-fluid" footer={cityDialogFooter} onHide={hideDialog}>
                        <form id="formCity" onSubmit={formik.handleSubmit}>
                            <div className="field">
                                <label htmlFor="name">Nome</label>
                                <InputText id="name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('name') })} />
                                {getFormErrorMessage('name')}
                            </div>

                            <div className="field">
                                <label htmlFor="name">Estado</label>
                                <Dropdown id="state" value={formik.values.state} filter onChange={formik.handleChange} options={states} placeholder="Selecione o Estado" />
                            </div>
                        </form>
                    </Dialog>

                    <Dialog visible={cityDeleteDialog} style={{ width: '450px' }} header="Confirmação" modal footer={deleteCityDialogFooter} onHide={hideDeleteCityDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {city && <span>Deseja excluir a Cidade de <b>{city.name}</b>?</span>}
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

export default React.memo(City, comparisonFn);
