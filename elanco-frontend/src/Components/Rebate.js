import React, { useState } from "react";
import {ImCross} from "react-icons/im"
const Rebate = (rebate) => {
  const [selectedValue, setSelectedValue] = useState();
  const onCross = () =>{
    const tempProducts = [...rebate.products]
    

     tempProducts.splice(rebate.index,1)
    rebate.setProducts(tempProducts)
  }

  const subRebate = rebate.rebate;
  return (
    <>
      <div class="rebate-products">
        <div class="rebate-product">
          <div class="rebate-product-header">
            <img src={subRebate.image} width="100px" height="40px" />
            <h5>{subRebate.productName}</h5>
            <ImCross onClick={onCross}/>
          </div>
          <div class="rebate-product-details">
            <h5>Offer details</h5>
            <h5>Rebate value</h5>
            <h5>Is Selected</h5>

            {subRebate.rebateValue.map((val, key) => {
              return (
                <>
                  <p className>{val[0]}</p>
                  <p className>${val[1]}</p>
                  <input
                    type="checkbox"
                    onChange={() => setSelectedValue(key)}
                    checked={selectedValue === key}
                  />
                </>
              );
            })}
          </div>
          <a>Terms and Conditions</a>
        </div>
      </div>
    </>
  );
};

export default Rebate;
