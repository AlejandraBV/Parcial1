var request = new XMLHttpRequest();
request.open("GET", "./restaurant.json", false);
request.send(null);
var data = JSON.parse(request.responseText);

const title = document.getElementById("ctitle");
const divCards = document.getElementById("divCards");
const dItems = document.getElementById("dItems");
var orden = [];
var items = 0;
var total = 0;
getElement("Burguers");

function getElement(pName) {
  for (obj of data) {
    if (obj.name == pName) {
      var lprod = obj.products;
      var txt = "<div class='row'>";
      //div de la columna
      for (let i = 0; i < obj.products.length; i++) {
        var aName = obj.products[i].name,
          aPrice = obj.products[i].price;
        txt +=
          "<div class='col-3 mb-4'><div class='card' style='width: 19rem; height:500px'>" +
          "<div class='content-img'><img class='card-img-top' src=" +
          obj.products[i].image +
          " alt='Card image cap' style='width:100x100px; height:200px object-fit: contain;'></div>" +
          "<div class='card-body'> <h5 class='card-title' style='font-weight: bold'>" +
          obj.products[i].name +
          "</h5>" +
          "<p class='card-text'>" +
          obj.products[i].description +
          "</p>" +
          "<div class='bdiv'><p class='card-text' style='font-weight: bold'>$" +
          obj.products[i].price +
          "</p>" +
          "<button class='btn mbtn' onclick='addElement(\"" +
          aName +
          '","' +
          aPrice +
          "\")'>Add to cart</button></div>" +
          "</div></div></div>";
      }
      txt += "</div>";
      divCards.innerHTML = txt;
    }
  }
  var nName = pName.toString();
  if (nName == "Burguers") nName = "Burgers";
  title.innerHTML = nName;
}

function addElement(eName, ePrice) {
  var nObj;
  items += 1;
  var entro = false;
  for (let i = 0; i < orden.length; i++) {
    var eItem = orden[i].split(";");
    if (eItem[0] == eName) {
      var eQuan = parseInt(eItem[2], 10);
      eQuan += 1;
      total += parseFloat(ePrice);
      orden[i] = eItem[0] + ";" + eItem[1] + ";" + eQuan + "";
      entro = true;
    }
  }
  if (!entro) {
    nObj = eName + ";" + ePrice + ";1";
    orden.push(nObj);
    total += parseFloat(ePrice);
  }
  dItems.innerHTML = items + " items";
}

function showCart() {
  title.innerHTML = "Order detail";
  var stxt =
    "<table class='table table-striped'><thead>" +
    "<tr><th scope= 'col'>Item</th>" +
    "<th scope= 'col'>Qty.</th>" +
    "<th scope= 'col'>Description</th>" +
    "<th scope= 'col'>Unit Price</th>" +
    "<th scope= 'col'>Amount</th>" +
    "<th scope= 'col'>Modify</th>" +
    "</tr></thead><tbody>";

  for (let i = 0; i < orden.length; i++) {
    let sData = orden[i].split(";");
    let sUnit = parseFloat(sData[1]);
    let sQty = parseFloat(sData[2]);
    let sAmount = sUnit * sQty;
    stxt +=
      "<tr><th scope = 'row'>" +
      (i + 1) +
      "</th>" +
      "<td>" +
      sData[2] +
      "</td>" +
      "<td>" +
      sData[0] +
      "</td>" +
      "<td>" +
      sData[1] +
      "</td>" +
      "<td>" +
      sAmount.toFixed(2) +
      "</td>" +
      "<td><div class='row' id='divBut'><button class='ml-5 mod' onclick='modifyOrder(\"add\",\"" +
      i +
      "\")'>+</button>" +
      "<button class='mod' onclick='modifyOrder(\"sub\",\"" +
      i +
      "\")'>-</button></div></td></tr>";
  }

  stxt += "</tbody></table>";
  stxt +=
    "<div class='row'><div class='col-8 d-flex align-content-center flex-wrap'><h7 style='font-weight: bold'>Total: $" +
    total.toFixed(2) +
    "</h7></div><div class='col-4 pl-4 d-flex' id='botDiv'>" +
    "<button type='button' class='bCancel' data-bs-toggle='modal' data-bs-target='#exampleModal' id='butCancel'>Cancel</button>" +
    "<button class='bConfirm' onclick='confirmOrder()'>Confirm order</button>" +
    "</div></div>";
  divCards.innerHTML = stxt;
  dItems.innerHTML = items + " items";
}

function modifyOrder(op, pid) {
  var mid = parseInt(pid, 10);
  let mord = orden[mid].split(";");
  let mQty = parseInt(mord[2], 10);
  let mPrice = parseFloat(mord[1]);
  if (op == "add") {
    mQty += 1;
    items += 1;
    orden[mid] = mord[0] + ";" + mord[1] + ";" + mQty;
    total += mPrice;
  } else {
    if (mQty != 1) {
      mQty -= 1;
      orden[mid] = mord[0] + ";" + mord[1] + ";" + mQty;
    } else orden.splice(mid, 1);
    items -= 1;
    total -= mPrice;
  }
  showCart();
}

function cancelOrder() {
  console.log("cancel");
}

function confirmOrder() {
  let xtxt = "[";
  for (let i = 0; i < orden.length; i++) {
    let cItem = orden[i].split(";");
    xtxt +=
      '{"item": ' +
      (i + 1) +
      ', "quantity": ' +
      cItem[2] +
      ', "description": "' +
      cItem[0] +
      '", "unitPrice": ' +
      cItem[1] +
      "}";
    if (i != orden.length - 1) xtxt += ",";
  }
  xtxt += "]";
  let cObj = JSON.parse(xtxt);
  console.log(cObj);
}

function deleteCart() {
  orden = [];
  items = 0;
  total = 0;
  showCart();
}
