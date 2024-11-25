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
import { ProductService } from '../../service/register/ProductService';
import { CategoryService } from '../../service/register/CategoryService';
import { MarkService } from '../../service/register/MarkService';

const Product = () => {

    let productNew = {
        shortDescription: '',
        detailedDescription: '',
        costValue: '',
        saleValue: '',
        category: '',
        mark: ''
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
            let _product = { ...product};
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

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product};
        _product[`${name}`] = val;

        setProduct(_product);
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
            <Button label="Salvar" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
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
                        <div className="field">
                            <label htmlFor="shortDescription">Descrição Curta</label>
                            <InputText id="shortDescription" value={product.shortDescription} onChange={(e) => onInputChange(e, 'shortDescription')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.shortDescription })} />
                            {submitted && !product.shortDescription && <small className="p-invalid">Descrição curta é obrigatória.</small>}
                        </div>
    
                        <div className="field">
                            <label htmlFor="detailedDescription">Descrição Detalhada</label>
                            <InputText id="detailedDescription" value={product.detailedDescription} onChange={(e) => onInputChange(e, 'detailedDescription')} className={classNames({ 'p-invalid': submitted && !product.detailedDescription })} />
                        </div>
    
                        <div className="field">
                            <label htmlFor="costValue">Valor de Custo</label>
                            <InputText id="costValue" value={product.costValue} onChange={(e) => onInputChange(e, 'costValue')} required className={classNames({ 'p-invalid': submitted && !product.costValue })} />
                            {submitted && !product.costValue && <small className="p-invalid">Valor de custo é obrigatório.</small>}
                        </div>
    
                        <div className="field">
                            <label htmlFor="saleValue">Valor de Venda</label>
                            <InputText id="saleValue" value={product.saleValue} onChange={(e) => onInputChange(e, 'saleValue')} required className={classNames({ 'p-invalid': submitted && !product.saleValue })} />
                            {submitted && !product.saleValue && <small className="p-invalid">Valor de venda é obrigatório.</small>}
                        </div>
    
                        <div className="field">
                            <label htmlFor="category">Categoria</label>
                            <Dropdown value={product.category} filter onChange={(e) => setProduct({ ...product, category: e.value })} options={categories} placeholder="Selecione a Categoria" />
                        </div>
    
                        <div className="field">
                            <label htmlFor="mark">Marca</label>
                            <Dropdown value={product.mark} filter onChange={(e) => setProduct({ ...product, mark: e.value })} options={marks} placeholder="Selecione a Marca" />
                        </div>
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