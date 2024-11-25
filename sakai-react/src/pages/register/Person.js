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
import { PersonService } from '../../service/register/PersonService';
import { CityService } from '../../service/register/CityService';

const Person = () => {

    let personNew = {
        name: '',
        cpf: '',
        email: '',
        cep: '',
        address: '',
        city: ''
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
            let _person = { ...person};
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

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _person = { ...person};
        _person[`${name}`] = val;

        setPerson(_person);
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
            <Button label="Salvar" icon="pi pi-check" className="p-button-text" onClick={savePerson} />
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
                        <div className="field">
                            <label htmlFor="name">Nome</label>
                            <InputText id="name" value={person.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !person.name })} />
                            {submitted && !person.name && <small className="p-invalid">Nome é obrigatória.</small>}
                        </div>
    
                        <div className="field">
                            <label htmlFor="cpf">CPF</label>
                            <InputText id="cpf" value={person.cpf} onChange={(e) => onInputChange(e, 'cpf')} className={classNames({ 'p-invalid': submitted && !person.cpf })} />
                            {submitted && !person.cpf && <small className="p-invalid">CPF é obrigatório.</small>}
                        </div>
    
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <InputText id="email" value={person.email} onChange={(e) => onInputChange(e, 'email')} required className={classNames({ 'p-invalid': submitted && !person.email })} />
                            {submitted && !person.email && <small className="p-invalid">Email é obrigatório.</small>}
                        </div>
    
                        <div className="field">
                            <label htmlFor="cep">CEP</label>
                            <InputText id="cep" value={person.cep} onChange={(e) => onInputChange(e, 'cep')} required className={classNames({ 'p-invalid': submitted && !person.cep })} />
                            {submitted && !person.cep && <small className="p-invalid">CEP é obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="address">Endereço</label>
                            <InputText id="address" value={person.address} onChange={(e) => onInputChange(e, 'address')} required className={classNames({ 'p-invalid': submitted && !person.address })} />
                            {submitted && !person.address && <small className="p-invalid">Enedereço é obrigatório.</small>}
                        </div>
    
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <Dropdown value={person.city} filter onChange={(e) => setPerson({ ...person, city: e.value })} options={cities} placeholder="Selecione a Cidade" />
                        </div>
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