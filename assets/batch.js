/* Batch fee calculator + CSV export.
   Uses the same verified engines as the single calculators
   (window.FeeEngines.platformCalc, with the comparison defaults).
   Totals are plain sums of the rounded per-row values that are
   displayed, so the totals row always equals the sum of the rows
   above it. Nothing typed here leaves the browser. */
(function () {
  "use strict";
  var E = window.FeeEngines;
  var $ = function (id) { return document.getElementById(id); };
  var batchBody = $("batch-body");
  if (!E || !batchBody) return;
  var r2 = E.r2, money = E.money, neg = E.neg, pct = E.pct;
  var JA = document.documentElement.lang === "ja";

  function batchRow(name, price, ship, cost, shipcost) {
    var tr = document.createElement("tr");
    tr.innerHTML =
        '<td data-label="' + (JA ? "商品名" : "Item name") + '"><input class="name b-name" type="text" value=""></td>'
      + '<td data-label="' + (JA ? "販売価格" : "Sale price") + '"><input class="b-price" type="number" inputmode="decimal" min="0" step="0.01"></td>'
      + '<td data-label="' + (JA ? "請求送料" : "Shipping charged") + '"><input class="b-ship" type="number" inputmode="decimal" min="0" step="0.01"></td>'
      + '<td data-label="' + (JA ? "仕入価格" : "Item cost") + '"><input class="b-cost" type="number" inputmode="decimal" min="0" step="0.01"></td>'
      + '<td data-label="' + (JA ? "実際の送料" : "Actual shipping") + '"><input class="b-shipcost" type="number" inputmode="decimal" min="0" step="0.01"></td>'
      + '<td class="num mono" data-label="' + (JA ? "手数料合計" : "Total fees") + '">-$0.00</td>'
      + '<td class="num mono" data-label="' + (JA ? "純利益" : "Net profit") + '">$0.00</td>'
      + '<td class="num mono" data-label="' + (JA ? "利益率" : "Margin") + '">0%</td>'
      + '<td data-label=""><button type="button" class="row-del" aria-label="' + (JA ? "行を削除" : "Remove row") + '">×</button></td>';
    tr.querySelector(".b-name").value = name;
    tr.querySelector(".b-price").value = price;
    tr.querySelector(".b-ship").value = ship;
    tr.querySelector(".b-cost").value = cost;
    tr.querySelector(".b-shipcost").value = shipcost;
    tr.querySelectorAll("input").forEach(function (inp) { inp.addEventListener("input", calcBatch); });
    tr.querySelector(".row-del").addEventListener("click", function () { tr.remove(); calcBatch(); });
    batchBody.appendChild(tr);
  }

  function rowNum(tr, cls) {
    var v = parseFloat(tr.querySelector(cls).value);
    return isNaN(v) || v < 0 ? 0 : v;
  }

  function calcBatch() {
    var key = $("batch-platform").value;
    var tPrice = 0, tShip = 0, tCost = 0, tShipcost = 0, tFees = 0, tProfit = 0, tRevenue = 0, n = 0;
    batchBody.querySelectorAll("tr").forEach(function (tr) {
      var price = rowNum(tr, ".b-price"), ship = rowNum(tr, ".b-ship"),
          cost = rowNum(tr, ".b-cost"), sc = rowNum(tr, ".b-shipcost");
      var r = E.platformCalc(key, price, ship, cost, sc);
      var cells = tr.querySelectorAll("td");
      cells[5].textContent = neg(r.fees);
      cells[6].textContent = money(r.profit);
      cells[6].style.color = r.profit < 0 ? "var(--neg)" : "";
      cells[7].textContent = pct(r.revenue > 0 ? r.profit / r.revenue * 100 : 0);
      tPrice = r2(tPrice + price); tShip = r2(tShip + ship); tCost = r2(tCost + cost); tShipcost = r2(tShipcost + sc);
      tFees = r2(tFees + r.fees); tProfit = r2(tProfit + r.profit); tRevenue = r2(tRevenue + r.revenue); n++;
    });
    $("batch-count").textContent = n;
    $("bt-price").textContent = money(tPrice);
    $("bt-ship").textContent = money(tShip);
    $("bt-cost").textContent = money(tCost);
    $("bt-shipcost").textContent = money(tShipcost);
    $("bt-fees").textContent = neg(tFees);
    $("bt-profit").textContent = money(tProfit);
    $("bt-margin").textContent = pct(tRevenue > 0 ? tProfit / tRevenue * 100 : 0);
  }

  function csvCell(s) {
    s = String(s);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }

  $("batch-add").addEventListener("click", function () { batchRow("", "", "", "", ""); calcBatch(); });
  $("batch-platform").addEventListener("change", calcBatch);
  $("batch-csv").addEventListener("click", function () {
    var key = $("batch-platform").value;
    var lines = [JA ? "商品名,販売価格,請求送料,仕入価格,実際の送料,売上,手数料合計,純利益,利益率 %" : "Item name,Sale price,Shipping charged,Item cost,Actual shipping,Revenue,Total fees,Net profit,Margin %"];
    var tFees = 0, tProfit = 0;
    batchBody.querySelectorAll("tr").forEach(function (tr) {
      var name = tr.querySelector(".b-name").value;
      var price = rowNum(tr, ".b-price"), ship = rowNum(tr, ".b-ship"),
          cost = rowNum(tr, ".b-cost"), sc = rowNum(tr, ".b-shipcost");
      var r = E.platformCalc(key, price, ship, cost, sc);
      var margin = r.revenue > 0 ? (r.profit / r.revenue * 100) : 0;
      lines.push([csvCell(name), price.toFixed(2), ship.toFixed(2), cost.toFixed(2), sc.toFixed(2),
                  r.revenue.toFixed(2), r.fees.toFixed(2), r.profit.toFixed(2), margin.toFixed(1)].join(","));
      tFees = r2(tFees + r.fees); tProfit = r2(tProfit + r.profit);
    });
    lines.push([JA ? "合計" : "TOTAL", "", "", "", "", "", tFees.toFixed(2), tProfit.toFixed(2), ""].join(","));
    var blob = new Blob([lines.join("\n")], { type: "text/csv" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "fee-batch-" + key + ".csv";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
  });

  batchRow(JA ? "ヴィンテージデニムジャケット" : "Vintage denim jacket", 50, 5, 20, 6);
  batchRow(JA ? "スニーカー — 中古・状態良好" : "Sneakers — used, good condition", 85, 0, 35, 9);
  batchRow(JA ? "ハンドメイド陶器マグ" : "Handmade ceramic mug", 28, 4, 9, 5);
  calcBatch();
})();
