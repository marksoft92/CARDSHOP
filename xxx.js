let products = []
let status = []

async function getProducts() {
    
    const response = await fetch('./productsList.json',{method: 'GET'})
    products = await response.json();
  }

function createProductCard () {
    const container = document.querySelector('#container')
    container.innerHTML = `
    
    
    ${
        Object.values(products).map(el => typeof el === "object" ?`
        
        <div class="card">
            <div class="statusList">${el.prod_status.split(",").map(v =>  v !== "" ?`<span>${v}</span>`:'')}</div>
            <div class="img">
                <img src="${el.prod_img_src}" alt="${el.prd_name}"></img>
            </div>
            <span>${el.prod_name}</span>
            <span>${el.prod_buy_price}</span>
        </div>`:'').join("")
    }    
`;
}  

function setStatus () {
    let allSatus = ['select'];
    for (let index in products) {
        if (index !== 'response_code') {
            for(prodStatus of products?.[index]?.['prod_status']?.split(",")) {
                allSatus.push(prodStatus)
            }
        }          
    }
    status = new Set(allSatus)
}

function generateSelect(val) {
    let myParent = document.querySelector('#nav-select');
    let check = true;

    if (check && !val) {
        let selectList = document.createElement("select");
        selectList.id = "mySelect";
        selectList.setAttribute("onchange", 'getSelectedProducts()');
        myParent.appendChild(selectList);
    
        for (let i of status) {
            if (i !== '') {
                let option = document.createElement("option");
                option.value = i;
                option.text = i;
                selectList.appendChild(option);
            }
        }
        check = false;
        
    }console.log(check)
}


async function loading(check) {
    await getProducts()
    await createProductCard()
    await setStatus()
    await generateSelect(check)
}
loading()
function getSelectedProducts() {
    getProducts()
    let result = []
    const value = document.getElementById("mySelect").value;
    for (let index in products) {
        if(products[index]['prod_status']?.includes(value)) {
            
            result.push(products[index])
        }
    }

    if (value === "select") loading(true)

    products = result
    createProductCard()
}