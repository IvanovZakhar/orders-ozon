import useOrderService from '../../services/OrderService';
import { useEffect } from 'react';

const TestPage = ({props, allProducts, basketsProduct}) => {
    // const  { updateData } = useOrderService();

    // const resBasket = basketsProduct ? basketsProduct.map(item => {
    //     const itemsArray = item.comps.split(";").map((item) => {
    //         const itemParts = item.trim().split("-");
    //         return {
    //           name: itemParts[0].trim(),
    //           quantity: itemParts[1] ? itemParts[1].trim().slice(0, -3) : null,
    //         };
    //       });
        
    //       const lastFourItems = itemsArray.slice(-5);

    //     return {artic: item.artic, comps: lastFourItems}
    // }) : null;

    // const i940 = 580;
    // const i1040 = 860;
    // const i1150 = 1170;
    // const i1300 = 1510;

    // const k940 = 680;
    // const k1040 = 860;
    // const k1150 = 1220;
    // const k1300 = 1500;

    // const pk940 = 1080;
    // const pk1040 = 1260;
    // const pk1150 = 1540;
    // const pk1300 = 1960;
    
    // const kk940 = 2350;
    // const kk1040 = 2680;
    // const kk1150 = 3290;
    // const kk1300 = 4070;

    // const res = props ? props.map((item, i )=> {
    // // Жалюзи 
 

    //     if(item.articul.slice(3, 12) === '10-0940-Ж'){
    //          return {
    //              ...item,
    //              price: 8740
    //          } 
    //       }
    //     if(item.articul.slice(3, 12) === '10-1040-Ж'){
    //         return {
    //             ...item,
    //             price: 10680
    //         } 
    //      }
    //      if(item.articul.slice(3, 12) === '10-1150-Ж'){
    //         return {
    //             ...item,
    //             price: 13390
    //         } 
    //      }
    //      if(item.articul.slice(3, 12) === '10-1300-Ж'){
    //         return {
    //             ...item,
    //             price: 17500
    //         } 
    //      }
    //      if(item.articul.slice(3, 12) === '20-0940-Ж'){
    //         return {
    //             ...item,
    //             price: 9830
    //         } 
    //      }
    //    if(item.articul.slice(3, 12) === '20-1040-Ж'){
    //        return {
    //            ...item,
    //            price: 12330
    //        } 
    //     }
    //     if(item.articul.slice(3, 12) === '20-1150-Ж'){
    //        return {
    //            ...item,
    //            price: 15450
    //        } 
    //     }
    //     if(item.articul.slice(3, 12) === '20-1300-Ж'){
    //        return {
    //            ...item,
    //            price: 19780
    //        } 
    //     }
    //     if(item.articul.slice(3, 12) === '30-0940-Ж'){
    //         return {
    //             ...item,
    //             price: 11120 + 580
    //         } 
    //      }
    //    if(item.articul.slice(3, 12) === '30-1040-Ж'){
    //        return {
    //            ...item,
    //            price: 14760 + 860
    //        } 
    //     }
    //     if(item.articul.slice(3, 12) === '30-1150-Ж'){
    //        return {
    //            ...item,
    //            price: 18780 + 1170
    //        } 
    //     }
    //     if(item.articul.slice(3, 12) === '30-1300-Ж'){
    //        return {
    //            ...item,
    //            price: 22840 + 1510
    //        } 
    //     }
    //     if(item.articul.slice(3, 12) === '40-0940-Ж'){
    //         return {
    //             ...item,
    //             price: 12600 + i940
    //         } 
    //      }
    //    if(item.articul.slice(3, 12) === '40-1040-Ж'){
    //        return {
    //            ...item,
    //            price: 16480 + i1040
    //        } 
    //     }
    //     if(item.articul.slice(3, 12) === '40-1150-Ж'){
    //        return {
    //            ...item,
    //            price: 20840 + i1150
    //        } 
    //     }
    //     if(item.articul.slice(3, 12) === '40-1300-Ж'){
    //        return {
    //            ...item,
    //            price: 25100 + i1300
    //        } 
    //     }

 
    //      if(item.articul.slice(3, 12) === '31-0940-Ж'){
    //          return {
    //              ...item,
    //              price: 11120 + i940 + pk940
    //          } 
    //       }
    //     if(item.articul.slice(3, 12) === '31-1040-Ж'){
    //         return {
    //             ...item,
    //             price: 14760 + i1040 + pk1040
    //         } 
    //      }
    //      if(item.articul.slice(3, 12) === '31-1150-Ж'){
    //         return {
    //             ...item,
    //             price: 18780 + i1150 + pk1150
    //         } 
    //      }
    //      if(item.articul.slice(3, 12) === '31-1300-Ж'){
    //         return {
    //             ...item,
    //             price: 22840 + i1300 + pk1300
    //         } 
    //      }

    //      if(item.articul.slice(3, 12) === '32-0940-Ж'){
    //         return {
    //             ...item,
    //             price: 11120 + i940 + kk940
    //         } 
    //      }
    //    if(item.articul.slice(3, 12) === '32-1040-Ж'){
    //        return {
    //            ...item,
    //            price: 14760 + i1040 + kk1040
    //        } 
    //     }
    //     if(item.articul.slice(3, 12) === '32-1150-Ж'){
    //        return {
    //            ...item,
    //            price: 18780 + i1150 + kk1150
    //        } 
    //     }
    //     if(item.articul.slice(3, 12) === '32-1300-Ж'){
    //        return {
    //            ...item,
    //            price: 22840 + i1300 + kk1300
    //        } 
    //     }

    //     if(item.articul.slice(3, 12) === '41-0940-Ж'){
    //         return {
    //             ...item,
    //             price: 12600 + i940 + pk940
    //         } 
    //      }
    //    if(item.articul.slice(3, 12) === '41-1040-Ж'){
    //        return {
    //            ...item,
    //            price: 16480 + i1040 + pk1040
    //        } 
    //     }
    //     if(item.articul.slice(3, 12) === '41-1150-Ж'){
    //        return {
    //            ...item,
    //            price: 20840 + i1150 + pk1150
    //        } 
    //     }
    //     if(item.articul.slice(3, 12) === '41-1300-Ж'){
    //        return {
    //            ...item,
    //            price: 25100 + i1300 + pk1300
    //        } 
    //     }

    //     if(item.articul.slice(3, 12) === '42-0940-Ж'){
    //         return {
    //             ...item,
    //             price: 12600 + i940 + kk940
    //         } 
    //      }
    //    if(item.articul.slice(3, 12) === '42-1040-Ж'){
    //        return {
    //            ...item,
    //            price: 16480 + i1040 + kk1040
    //        } 
    //     }
    //     if(item.articul.slice(3, 12) === '42-1150-Ж'){
    //        return {
    //            ...item,
    //            price: 20840 + i1150 + kk1150
    //        } 
    //     }
    //     if(item.articul.slice(3, 12) === '42-1300-Ж'){
    //        return {
    //            ...item,
    //            price: 25100 + i1300 + kk1300
    //        } 
    //     }

    //         // Корзины
    
    //         if(item.articul.slice(3, 12) === '10-0940-К'){
    //             return {
    //                 ...item,
    //                 price: 6670
    //             } 
    //          }
    //        if(item.articul.slice(3, 12) === '10-1040-К'){
    //            return {
    //                ...item,
    //                price: 7840
    //            } 
    //         }
    //         if(item.articul.slice(3, 12) === '10-1150-К'){
    //            return {
    //                ...item,
    //                price: 9610
    //            } 
    //         }
    //         if(item.articul.slice(3, 12) === '10-1300-К'){
    //            return {
    //                ...item,
    //                price: 13260
    //            } 
    //         }
    //         if(item.articul.slice(3, 12) === '20-0940-К'){
    //            return {
    //                ...item,
    //                price: 8470
    //            } 
    //         }
    //       if(item.articul.slice(3, 12) === '20-1040-К'){
    //           return {
    //               ...item,
    //               price: 9970
    //           } 
    //        }
    //        if(item.articul.slice(3, 12) === '20-1150-К'){
    //           return {
    //               ...item,
    //               price: 12260
    //           } 
    //        }
    //        if(item.articul.slice(3, 12) === '20-1300-К'){
    //           return {
    //               ...item,
    //               price: 16610
    //           } 
    //        }
    //        if(item.articul.slice(3, 12) === '30-0940-К'){
    //            return {
    //                ...item,
    //                price: 8760 + k940
    //            } 
    //         }
    //       if(item.articul.slice(3, 12) === '30-1040-К'){
    //           return {
    //               ...item,
    //               price: 10810 + k1040
    //           } 
    //        }
    //        if(item.articul.slice(3, 12) === '30-1150-К'){
    //           return {
    //               ...item,
    //               price: 13570 + k1150
    //           } 
    //        }
    //        if(item.articul.slice(3, 12) === '30-1300-К'){
    //           return {
    //               ...item,
    //               price: 17900 + k1300
    //           } 
    //        }
    //        if(item.articul.slice(3, 12) === '40-0940-К'){
    //            return {
    //                ...item,
    //                price: 10570 + k940
    //            } 
    //         }
    //       if(item.articul.slice(3, 12) === '40-1040-К'){
    //           return {
    //               ...item,
    //               price: 12930 + k1040
    //           } 
    //        }
    //        if(item.articul.slice(3, 12) === '40-1150-К'){
    //           return {
    //               ...item,
    //               price: 16220 + k1150
    //           } 
    //        }
    //        if(item.articul.slice(3, 12) === '40-1300-К'){
    //           return {
    //               ...item,
    //               price: 20890 + k1300
    //           } 
    //        }
   
    
    //         if(item.articul.slice(3, 12) === '31-0940-К'){
    //             return {
    //                 ...item,
    //                 price: 8760 + k940 + pk940
    //             } 
    //          }
    //        if(item.articul.slice(3, 12) === '31-1040-К'){
    //            return {
    //                ...item,
    //                price: 10810 + k1040 + pk1040
    //            } 
    //         }
    //         if(item.articul.slice(3, 12) === '31-1150-К'){
    //            return {
    //                ...item,
    //                price: 13570 + k1150 + pk1150
    //            } 
    //         }
    //         if(item.articul.slice(3, 12) === '31-1300-К'){
    //            return {
    //                ...item,
    //                price: 17900 + k1300 + pk1300
    //            } 
    //         }
   
    //         if(item.articul.slice(3, 12) === '32-0940-К'){
    //            return {
    //                ...item,
    //                price: 10570 + k940 + kk940
    //            } 
    //         }
    //       if(item.articul.slice(3, 12) === '32-1040-К'){
    //           return {
    //               ...item,
    //               price: 12930 + k1040 + kk1040
    //           } 
    //        }
    //        if(item.articul.slice(3, 12) === '32-1150-К'){
    //           return {
    //               ...item,
    //               price: 16220 + k1150 + kk1150
    //           } 
    //        }
    //        if(item.articul.slice(3, 12) === '32-1300-К'){
    //           return {
    //               ...item,
    //               price: 20890 + k1300 + kk1300
    //           } 
    //        }

    //        if(item.articul.slice(3, 12) === '41-0940-К'){
    //         return {
    //             ...item,
    //             price: 10570 + k940 + pk940
    //         } 
    //      }
    //    if(item.articul.slice(3, 12) === '41-1040-К'){
    //        return {
    //            ...item,
    //            price: 12930 + k1040 + pk1040
    //        } 
    //     }
    //     if(item.articul.slice(3, 12) === '41-1150-К'){
    //        return {
    //            ...item,
    //            price: 16220 + k1150 + pk1150
    //        } 
    //     }
    //     if(item.articul.slice(3, 12) === '41-1300-К'){
    //        return {
    //            ...item,
    //            price: 20890 + k1300 + pk1300
    //        } 
    //     }

    //     if(item.articul.slice(3, 12) === '42-0940-К'){
    //         return {
    //             ...item,
    //             price: 10570 + k940 + kk940
    //         } 
    //      }
    //    if(item.articul.slice(3, 12) === '42-1040-К'){
    //        return {
    //            ...item,
    //            price: 12930 + k1040 + kk1040
    //        } 
    //     }
    //     if(item.articul.slice(3, 12) === '42-1150-К'){
    //        return {
    //            ...item,
    //            price: 16220 + k1150 + kk1150
    //        } 
    //     }
    //     if(item.articul.slice(3, 12) === '42-1300-К'){
    //        return {
    //            ...item,
    //            price: 20890 + k1300 + kk1300
    //        } 
    //     }

 
    // }) : null;
   
    // console.log(allProducts)
    // console.log(resBasket)
 
 

// const updatedAccordion = allProducts ? allProducts.map((item) => {
//     const matchingArtic = resBasket.find((articItem) => articItem.artic === item.article);
//     if (matchingArtic) {
//       item.Column14 = `${matchingArtic.comps[0].name} - ${matchingArtic.comps[0].quantity}`;
//       item.Column15 = `${matchingArtic.comps[1].name} - ${matchingArtic.comps[1].quantity}`;
//       item.Column16 = `${matchingArtic.comps[2].name} - ${matchingArtic.comps[2].quantity}`;
//       item.Column17 = `${matchingArtic.comps[3].name} - ${matchingArtic.comps[3].quantity}`;
 
//     }
//     return item;
//   }): null
  
   
    


//     const cart = props ? props.filter(item => {
    
//           if(item.art.slice(4, 13) === '10-0940-Ж'){
//              return {
//                  ...item,
//                  size: '642х940х541'
//              } 
//           }
//           if(item.art.slice(4, 13) === '10-1150-Ж'){
//              return {
//                  ...item,
//                  size: '942х1150х641'
//              } 
//           }
//           if(item.art.slice(4, 13) === '10-1040-Ж'){
//              return {
//                  ...item,
//                  size: '792х1040х571'
//              } 
//           }
//           if(item.art.slice(4, 13) === '10-1300-Ж'){
//              return {
//                  ...item,
//                  size: '1065х1300х728'
//              } 
//           }
 
//      }) : null;
// console.log(cart)
//      const elem = cart ? cart.map(item => {
       
//           if(item.art.slice(7, 11) === '0940'){
//              return {
//                  ...item,
//                  size: '642х940х541'
//              } 
//           }
//           if(item.art.slice(7, 11) === '1150'){
//              return {
//                  ...item,
//                  size: '942х1150х641'
//              } 
//           }
//           if(item.art.slice(7, 11) === '1040'){
//              return {
//                  ...item,
//                  size: '792х1040х571'
//              } 
//           }
//           if(item.art.slice(7, 11) === '1300'){
//              return {
//                  ...item,
//                  size: '1065х1300х728'
//              } 
//           }
 
//      }) : null;
//     console.log(elem)
//     const baskets = elem ? elem.map(item => {
//         return (
//             <>
       
//                         <tr className='list-order__item' key={item.sku}>
//                             <td className='list-order__item'>{item.sku}</td>
//                             <td className='list-order__item posting-number'>{item.size}</td>
//                         </tr>
                        
          
//             </>
//         )
//     }) : null;


console.log(basketsProduct)
console.log(props)
const res = basketsProduct ? basketsProduct.map(item => {
   const elem = props ? props.filter(prop => {
        if(item.article.slice(3, 10) === prop.article.slice(3, 10)){
            return  {
                ...item, 
                package_contents: prop.compl
            }
        
        }
    }): null
    return {
        article: item.article, 
        package_contents: elem[0].compl
    }
}) : null
console.log(res)
    return (
        <>
                {/* <table className="list-order">
                    <thead>
                        <tr className='list-order__item'>
                            <th className='list-order__item'>SKU</th>
                            <th className='list-order__item'>Вариант размера</th>
                        </tr>
                    </thead>
                    <tbody>
                        {baskets}
                        
                    </tbody>
                
                </table> */}
            
           {/* { elem ? elem : <h1>nothing to test..</h1>} */}
           {/* <h1>nothing to test..</h1> */}
           {JSON.stringify(res)}
        </>
    )
}

export default TestPage;