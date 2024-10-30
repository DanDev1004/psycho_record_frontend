import React from 'react';

const Tabla = ({
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    pageIndex,
    pageOptions,
    previousPage,
    nextPage,
    canPreviousPage,
    canNextPage,
}) => {
    return (
        <div>
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => {
                        const { key, ...rest } = headerGroup.getHeaderGroupProps();
                        return (
                            <tr key={key} {...rest}>
                                {headerGroup.headers.map(column => {
                                    const { key: columnKey, ...columnRest } = column.getHeaderProps();
                                    return (
                                        <th key={columnKey} {...columnRest}>
                                            {column.render('Header')}
                                        </th>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map(row => {
                        prepareRow(row);
                        const { key: rowKey, ...rowRest } = row.getRowProps();
                        return (
                            <tr key={rowKey} {...rowRest}>
                                {row.cells.map(cell => {
                                    const { key: cellKey, ...cellRest } = cell.getCellProps();
                                    return (
                                        <td key={cellKey} {...cellRest}>
                                            {cell.render('Cell')}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>


            <div className="pagination">
                <span>
                    Página <strong>{pageIndex + 1} de {pageOptions.length}</strong>{' '}
                </span>
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {'<'}
                </button>{' '}
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    {'>'}
                </button>
            </div>
        </div>
    );
};

export default Tabla;
