const XLSX = require('xlsx');

// Excel dosyasini oku
const dataWB = XLSX.readFile('./odev1_data.xlsx');

const sheet = dataWB.Sheets[dataWB.SheetNames[0]];

const lastRow = parseInt(sheet['!ref'].split(':')[1].replace(/[A-Z]/g, ''));
console.log('LAST ROW:', lastRow);

const total = {
  'objectLOC':0,
  'newAndChangedLOC':0,
  'developmentHours':0
};
const variance = {
  'objectLOC':0,
  'newAndChangedLOC':0,
  'developmentHours':0
};

for (let i = 2; i <= lastRow; i++) {
  const objectLOC = sheet['A' + i];
  const newAndChangedLOC = sheet['B' + i];
  const developmentHours = sheet['C' + i];

 total.objectLOC += objectLOC.v;
 total.newAndChangedLOC += newAndChangedLOC.v;
 total.developmentHours += developmentHours.v;
}


console.log('Sum of Column1: ' + total.objectLOC);
console.log('Sum of Column2: ' + total.newAndChangedLOC);
console.log('Sum of Column3: ' + total.developmentHours);

const mean = {
  'objectLOC': total.objectLOC/(lastRow-1), 
  'newAndChangedLOC': total.newAndChangedLOC/(lastRow-1), 
  'developmentHours': total.developmentHours/(lastRow-1)
};

console.log('Mean of objectLOC: ' + mean.objectLOC);
console.log('Mean of newAndChangedLOC: ' + mean.newAndChangedLOC);
console.log('Mean of developmentHours: ' + mean.developmentHours);


   for (let i = 2; i <= lastRow; i++) {
    const objectLOC = sheet['A' + i];
    const newAndChangedLOC = sheet['B' + i];
    const developmentHours = sheet['C' + i];

      variance.objectLOC += Math.pow((objectLOC.v - mean.objectLOC),2);
      variance.newAndChangedLOC += Math.pow((newAndChangedLOC.v - mean.newAndChangedLOC),2);
      variance.developmentHours += Math.pow((developmentHours.v - mean.developmentHours),2);
  }

variance.objectLOC = Math.sqrt(variance.objectLOC/(lastRow-2));
variance.newAndChangedLOC = Math.sqrt(variance.newAndChangedLOC/(lastRow-2));
variance.developmentHours = Math.sqrt(variance.developmentHours/(lastRow-2));

console.log('Standart Deviation of objectLOC: ' + variance.objectLOC);
console.log('Standart Deviation of newAndChangedLOC: : ' + variance.newAndChangedLOC);
console.log('Standart Deviation of developmentHours: ' + variance.developmentHours);

// Yeni bir excel dosyasi olusturup verileri içerisine yaz
const wb = XLSX.utils.book_new();
wb.SheetNames.push('ResultData');
const wsData1 = [[' ','Object LOC Mean', 'New and Changed LOC Mean','Development Hours Mean']];
const data1 = ['Mean', mean.objectLOC,mean.newAndChangedLOC,mean.developmentHours];
const data2 = ['Standard Deviation',variance.objectLOC,variance.newAndChangedLOC,variance.developmentHours];
wsData1.push(data1);
wsData1.push(data2);
  
const ws = XLSX.utils.aoa_to_sheet(wsData1);
wb.Sheets['ResultData'] = ws;
XLSX.writeFile(wb, './mean_varyance_calculation.xlsx', {bookType:'xlsx', bookSST:true, type: 'binary'});
  