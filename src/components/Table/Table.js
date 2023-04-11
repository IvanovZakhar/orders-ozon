import './Table.scss'

function Table() {
    return (
      <table>
        <thead>

          <tr className='main__head'>
          <tr>
            <th className='name'><h2>ООО «ЦМА» 622-00-95</h2></th>
          </tr>
            <tr >
                <th>Дата оформления</th>
                <th>11.04.2023</th>
                <tr>
                    <th>Диллер</th>
                    <th>Озон</th>
                </tr>
                <tr>
                    <th>Оформил</th>
                    <th>Захар</th>
                </tr>
                <tr>
                    <th>Сборщик</th>
                    
                </tr>
            </tr>
            <tr  className='about-head'>
                <th>Дата отгрузки</th>
                <th className='about-head__time'>11.04.2023</th>
            </tr>
            <tr className='about-head'>
                <th>Время отгрузки</th>
                <th className='about-head__time'> 11.04.2023</th>
            </tr>
          </tr>

            <tr className='data-order'>
                <tr>
                    <th>Артикул</th>
                    <th className='data'>AR752031957-06</th>
        
                </tr>
                <tr>
                    <th>НОМЕР ОТПРАВЛЕНИЯ</th>
                    <th className='data'>29971100-0070-2</th>
                </tr>
            </tr>
        </thead>

        <tbody>
            <tr className='head-body'>
                <tr className='order-name'>
                    <th><h1>Название заказа</h1></th>
                </tr>
                <tr className='order-name'>
                    <th>Адрес склада/магазина</th>
                    <th className='address'>Адрес склада </th>
                </tr>
            </tr>

        <tr className='about-product'>
            <tr className='params'>
                <tr>
                     <th><h3>Параметры</h3></th> 
                </tr>
                <tr>
                    <th>Высота</th><th>-</th>
                </tr>
                <tr>
                    <th>Ширина</th><th>-</th>
                </tr>
                <tr>
                    <th>Вес</th><th>-</th>
                </tr>
                <tr>
                    <th>Габариты</th><th>-</th>
                </tr>
                <tr>
                    <th>Цвет</th><th>-</th>
                </tr>
            </tr>
            <tr className='complete'>
              
                <tr><th><h3>Комплектация</h3></th> </tr>
                <tr>
                    <th>Винты</th><th>-</th>
                </tr>
                <tr>
                    <th>Петли</th><th>-</th>
                </tr>
                <tr>
                    <th>Резьб. Вставки</th><th>-</th>
                </tr>
                <tr>
                    <th>Ролики</th><th>-</th>
                </tr>
            </tr>
        </tr>
 
        <tr className='note'>
              
              <tr><th><h3>Примечание</h3></th> </tr>
              <tr>
                  <th>-</th> 
              </tr>
              <tr>
                  <th>-</th> 
              </tr>
              <tr>
                  <th>-</th>
              </tr>
              <tr>
                  <th>-</th>
              </tr>
              <tr>
                  <th>-</th>
              </tr>
              <tr>
                  <th>-</th>
              </tr>
              <tr>
                  <th>-</th>
              </tr>
              <tr>
                  <th>-</th>
              </tr>
              <tr>
                  <th>-</th>
              </tr>
          </tr>
        </tbody>
    </table>)}
    
    export default Table;