import React, { useState } from "react";

const Rebate = (rebate) => {
  const [selectedValue, setSelectedValue] = useState(0);

  const subRebate = rebate.rebate;
  return (
    <>
      <div class="rebate-products">
        <div class="rebate-product">
          <div class="rebate-product-header">
            <img src={subRebate.image} width="100px" height="40px" />
            <h5>{subRebate.productName}</h5>
          </div>
          <div class="rebate-product-details">
            <h5>Offer details</h5>
            <h5>Rebate value</h5>
            <p></p>
            {subRebate.rebateValue.map((val, key) => {
              console.log(key);
              return (
                <>
                  <p className>
                    {val[0]}
                  </p>
                  <p className>
                    ${val[1]}
                  </p>
                  <input type="checkbox" value={true}/>
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
