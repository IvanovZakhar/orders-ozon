import './ListOrder.scss'

const ListOrder = (props) => {
    const elem = props.props ? props.props.map((item, i) => {
        const {date,
            postingNumber,
            productArt,productName,
            productPrice,
            quantity,
            warehouse} = item;
            return(
                <>
                    <tr key={i}>
                        <td>{i+=1}</td>
                        <td>{postingNumber}</td>
                        <td>{`${date.slice(8, 10)}.${date.slice(5, 7)}.${date.slice(0, 4)}`}</td>
                        <td className='productName'>{productName}</td>
                        <td>{productArt}</td>
                        <td>{productPrice.slice(0, -7)}</td>
                        <td>{quantity}</td>
                        <td className='warehouse'>{warehouse === "Крупногабарит" ? "П" : null}</td>
                    </tr>
                </>
            )
    }) : null;
    return( 
        <table className="list-order">
            <thead>
                <tr>
                    <th>№</th>
                    <th>Номер отправления</th>
                    <th>Дата отгрузки</th>
                    <th>Наименование товара</th>
                    <th className='art'>Артикул</th>
                    <th>Стоимость</th>
                    <th>Кол-во шт.</th>
                    <th>Склад</th>
                </tr>
            </thead>
            <tbody>
                {elem}
            </tbody>
        </table>
    )
}

export default ListOrder;