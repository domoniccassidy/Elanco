import React, { useState } from "react";
import { ImCross } from "react-icons/im";
const Rebate = (rebate,setProducts,products) => {
  const [selectedValue, setSelectedValue] = useState();
  const onAdd = () => {
    const tempProducts = [...rebate.products];
    const tempProduct = JSON.parse(JSON.stringify(rebate.rebate));
    tempProducts.push(tempProduct)
    console.log(tempProducts);
    tempProducts[0].amount = 1;
    rebate.setProducts(tempProducts);
  };

  const subRebate = rebate.rebate;
  return (
    <>
      <div class="rebate-products card">
        <div class="rebate-product" style={{ borderBottom: "1px solid " }}>
          <div class="rebate-product-header">
            <img src={subRebate.image} width="100px" height="40px" />
            <h5>{subRebate.productName}</h5>
          </div>
          <div class="rebate-product-details">
            <h5>Offer details</h5>
            <h5>Rebate value</h5>
            <p></p>

            {subRebate.rebateValue.map((val, key) => {
              return (
                <>
                  <p className>{val[0]}</p>
                  <p className>${val[1]}</p>
                  <p></p>
                </>
              );
            })}
          </div>
          <div class="modal-options-container">
            <a>Terms and Conditions</a>
            <div class="form-submit-cta">
              <button onClick={onAdd}>Add Rebate</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Rebate;
