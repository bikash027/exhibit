const lowInput = document.getElementById('lowInput');
const highInput = document.getElementById('highInput');
const res2a = document.getElementById('res2a');
const res2dAll = document.getElementById('res2dAll');
const res2dPrimes = document.getElementById('res2dPrimes');
const findPrimesButton = document.getElementById('findPrimes');
const resultMainContainer = document.getElementById('resultMain');
const resultDetailsContainer = document.getElementById('resultDetailsContainer');
resultDetailsContainer.style.display = 'none';
const closeDetailsButton = document.getElementById('closeDetails');
const showDetailsButton = document.getElementById('showDetails');
const res2b = document.getElementById('res2b').lastElementChild;
const res2c = document.getElementById('res2c').lastElementChild;


const checkIfPrime = (num) => {
    for(let i=2; i * i <= num; i++){
        if(num % i == 0) return false
    }
    return true;
}

let result = [];

const calculatePrimes = () => {
    resultMainContainer.style.display = 'none';
    result = [];
    const low = parseInt(lowInput.value);
    const high = parseInt(highInput.value);

    for(let i=low; i<=high; i++){
        const start = Date.now();
        const isPrime = checkIfPrime(i);
        const end = Date.now();
        result.push({
            number: i,
            isPrime,
            timeTaken: end - start
        })
    }

    // results
    let sumTimeTakenAll = 0;
    let sumTimeTakenPrimes = 0
    for(const el of result){
        sumTimeTakenAll += el.timeTaken;
        if(el.isPrime) sumTimeTakenPrimes += el.timeTaken;
    }
    res2a.textContent = sumTimeTakenAll;
    res2dAll.textContent = (sumTimeTakenAll / result.length).toFixed(2);
    res2dPrimes.textContent = (sumTimeTakenPrimes / result.length).toFixed(2);
    resultMainContainer.style.display = 'block';
}

findPrimesButton.addEventListener('click', calculatePrimes);

showDetailsButton.addEventListener('click', () => {
    resultDetailsContainer.style.display = 'flex';
    result.forEach(el => {
        const tr = document.createElement('tr');
        const td1 = document.createElement('td');
        td1.textContent = el.number;
        const td2 = document.createElement('td');
        td2.textContent = el.isPrime? 'Prime': 'Not prime';
        const td3 = document.createElement('td');
        td3.textContent = el.timeTaken;
        [td1, td2, td3].forEach(td => {
            td.classList.add('pv3', 'pr3', 'bb', 'b--black-20')
            tr.appendChild(td);
        })
        res2b.appendChild(tr);
    })
    // res2b.innerHTML = trNodesAll;
    result.filter(el => el.isPrime)
        .forEach(el => {
            const tr = document.createElement('tr');
            const td1 = document.createElement('td');
            td1.textContent = el.number;
            const td2 = document.createElement('td');
            td2.textContent = el.timeTaken;
            [td1, td2].forEach(td => {
                td.classList.add('pv3', 'pr3', 'bb', 'b--black-20')
                tr.appendChild(td);
            })
            res2c.appendChild(tr);
        })
})

closeDetailsButton.addEventListener('click', () => {
    resultDetailsContainer.style.display = 'none';
    res2b.innerHTML = '';
    res2c.innerHTML = '';
})

lowInput.addEventListener('change', () => {
    if(parseInt(lowInput.value) < 2)
        lowInput.value = 2;
    if(parseInt(lowInput.value) > parseInt(highInput.value))
        lowInput.value = highInput.value;
})

highInput.addEventListener('change', () => {
    if(parseInt(highInput.value) < 2)
        highInput.value = 2;
    if(parseInt(lowInput.value) > parseInt(highInput.value))
        highInput.value = lowInput.value;
})