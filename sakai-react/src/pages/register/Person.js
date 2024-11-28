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
import { InputMask } from 'primereact/inputmask';
import {useFormik} from 'formik';
import { PersonService } from '../../service/register/PersonService';
import { CityService } from '../../service/register/CityService';

const Person = () => {

    let personNew = {
        name: '',
        cpf: '',
        email: '',
        cep: '',
        address: '',
        city: null
    };

    const [people, setPeople] = useState(null);
    const [cities, setCities] = useState(null);
    const [personDialog, setPersonDialog] = useState(false);
    const [personDeleteDialog, setPersonDeleteDialog] = useState(false);
    const [person, setPerson] = useState(personNew);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const personService = new PersonService();
    const cityService = new CityService();

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: person,

        validate: (data) => {
            let errors = {};
        
            if (!data.name) {
                errors.name = "Nome é obrigatório.";
            }
        
            if (!data.cpf) {
                errors.cpf = "CPF é obrigatório.";
            } else if (!validateCPF(data.cpf)) {
                errors.cpf = "CPF inválido.";
            }
        
            if (!data.email) {
                errors.email = "Email é obrigatório.";
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
                errors.email = "Endereço de email inválido. Ex: examplo@gmail.com";
            }
        
            return errors;
        },
        onSubmit: (data) => {
            setPerson(data);
            savePerson();
            formik.resetForm();
        }
    });

    const validateCPF = (cpf) => {
        cpf = cpf.replace(/[^\d]+/g, '');
    
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    
        let sum = 0;
        let remainder;
    
        for (let i = 1; i <= 9; i++) {
            sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }
    
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.substring(9, 10))) return false;
    
        sum = 0;
        for (let i = 1; i <= 10; i++) {
            sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }
    
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
    
        return remainder === parseInt(cpf.substring(10, 11));
    };

    useEffect(() => {
        cityService.city().then((res) => {
            const formattedCities = res.data.map((city) => ({
                label: `${city.name}`,
                value: city,
            }));
            setCities(formattedCities);
        });
    }, [cityService]);

    useEffect(() => {
        if (people == null) {
            personService.person().then(res => {
                setPeople(res.data);
            });
        }
    }, [people, personService]);

    const openNew = () => {
        setPerson(personNew);
        setSubmitted(false);
        setPersonDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setPersonDialog(false);
    }

    const hideDeletePersonDialog = () => {
        setPersonDeleteDialog(false);
    }

    const savePerson = () => {
        setSubmitted(true);

        if(person.name.trim()){
            let _person = formik.values;
            if(person.id){
                personService.alter(_person).then(data => {
                    toast.current.show({severity: 'sucess', summary: 'Successful', detail: 'Product Updated', life: 3000 })
                    setPeople(null);
                    });
            }else{
                personService.insert(_person).then(data => {
                    toast.current.show({severity: 'sucess', summary: 'Successful', detail: 'Product Created', life: 3000 })
                    setPeople(null)
                });
            }
            setPersonDialog(false);
            setPerson(personNew);
        }
    }

    const editPerson = (person) => {
        setPerson({ ...person});
        setPersonDialog(true);
    }

    const confirmDeletePerson = (person) => {
        setPerson(person);
        setPersonDeleteDialog(true);
    }

    const deletePerson = () => {
        personService.delete(person.id).then(data => {
            toast.current.show({severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
            setPeople(null);
            setPersonDeleteDialog(false);
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
                    <Button label="Nova Pessoa" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
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

    const cpfBodyTemplate = (rowData) => {
        return(
            <>
                <span className='p-column-title'>CPF</span>
                {rowData.cpf}
            </>
        );
    }

    const emailBodyTemplate = (rowData) => {
        return(
            <>
                <span className='p-column-title'>Email</span>
                {rowData.email}
            </>
        );
    }

    const cepBodyTemplate = (rowData) => {
        return(
            <>
                <span className='p-column-title'>CEP</span>
                {rowData.cep}
            </>
        );
    }

    const addressBodyTemplate = (rowData) => {
        return(
            <>
                <span className='p-column-title'>Endereço</span>
                {rowData.address}
            </>
        );
    }

    const cityBodyTemplate = (rowData) => {
        return(
            <>
                <span className='p-column-title'>Cidade</span>
                {rowData.city && (rowData.city.name)}
            </>
        );
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editPerson(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeletePerson(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className='m-0'>Pessoas Cadastradas</h5>
            <span className='block mt-2 md:mt-0 p-input-icon-left'>
                <i className='pi pi-search'/>
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const personDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button type="submit" form="formPerson" label="Salvar" icon="pi pi-check" className="p-button-text" />
        </>
    );

    const deletePersonDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" className="p-button-text" onClick={hideDeletePersonDialog} />
            <Button label="Sim" icon="pi pi-check" className="p-button-text" onClick={deletePerson} />
        </>
    );

    return (
        <div className="grid table-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
    
                    <DataTable ref={dt} value={people}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={globalFilter} emptyMessage="No products found." header={header} responsiveLayout="scroll">
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                        <Column field="id" header="ID" sortable body={idBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="name" header="Nome" sortable body={nameBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="cpf" header="CPF" sortable body={cpfBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="email" header="Email" sortable body={emailBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="cep" header="CEP" sortable body={cepBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="address" header="Endereço" sortable body={addressBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="city" header="Cidade" sortable body={cityBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>
    
                    <Dialog visible={personDialog} style={{ width: '450px' }} header="Detalhes da Pessoa" modal className="p-fluid" footer={personDialogFooter} onHide={hideDialog}>
                        <form id="formPerson" onSubmit={formik.handleSubmit}>
                            <div className="field">
                                <label htmlFor="name">Nome*</label>
                                <InputText id="name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('name') })} />
                                {getFormErrorMessage('name')}
                            </div>
        
                            <div className="field">
                                <label htmlFor="cpf">CPF*</label>
                                <InputMask id="cpf" value={formik.values.cpf} mask="999.999.999-99" onChange={formik.handleChange} onBlur={formik.handleBlur} className={classNames({ 'p-invalid': isFormFieldValid('cpf') })}/>
                                {getFormErrorMessage('cpf')}
                            </div>
        
                            <div className="field">
                                <label htmlFor="email">Email*</label>
                                <InputText id="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} className={classNames({ 'p-invalid': isFormFieldValid('email') })} />
                                {getFormErrorMessage('email')}
                            </div>
        
                            <div className="field">
                                <label htmlFor="cep">CEP</label>
                                <InputMask id="cep" value={formik.values.cep} mask="99999-999" onChange={formik.handleChange} />
                            </div>

                            <div className="field">
                                <label htmlFor="address">Endereço</label>
                                <InputText id="address" value={formik.values.address} onChange={formik.handleChange} />
                            </div>
        
                            <div className="field">
                                <label htmlFor="city">Cidade</label>
                                <Dropdown id="city" value={formik.values.city} filter onChange={formik.handleChange} options={cities} placeholder="Selecione a Cidade" />
                            </div>
                        </form>
                    </Dialog>
    
                    <Dialog visible={personDeleteDialog} style={{ width: '450px' }} header="Confirmação" modal footer={deletePersonDialogFooter} onHide={hideDeletePersonDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {person && <span>Deseja excluir <b>{person.name}</b>?</span>}
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

export default React.memo(Person, comparisonFn);