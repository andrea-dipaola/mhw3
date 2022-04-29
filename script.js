/* TODO: inserite il codice JavaScript necessario a completare il MHW! */
function checked(event){    
    const ch = event.currentTarget;  
    const check = ch.querySelector('.checkbox');
    opac(ch.dataset.questionId);
    check.src = 'images/checked.png';
    ch.classList.remove('opacita');
    ch.classList.add('coloresfondo');

    if(ch.dataset.questionId === 'one'){
        q1 = ch.dataset.choiceId;
    }
    if(ch.dataset.questionId === 'two'){
        q2 = ch.dataset.choiceId;
    }
    if(ch.dataset.questionId === 'three'){
        q3 = ch.dataset.choiceId;
        endQuiz();
    }
}

function opac(questionId){
    const allBoxes = document.querySelectorAll('.choice-grid div');
    for(const box of allBoxes){
        if(box.dataset.questionId === questionId){
            box.classList.add('opacita');
            const check = box.querySelector('.checkbox');
            check.src = 'images/unchecked.png';
            box.classList.remove('coloresfondo');
        }
    }
}

function endQuiz(){
    let p1 = 0;
    let p2 = 0;

    const img_check = document.querySelectorAll('.choice-grid div');  
    for(const imgs of img_check){
        imgs.removeEventListener('click', checked);
    }
    
    if(q1 === q2 || q1 === q3){
        p1++;
    }
    if(q2 === q3 ){
        p2++;
    }
    if(p2 > p1){
        for(let i in RESULTS_MAP){
            if(i === q3){
                const title = document.createElement('h1');
                const contents = document.createElement('p');
                title.textContent = RESULTS_MAP[i].title;
                contents.textContent = RESULTS_MAP[i].contents;
                const button = document.querySelector('#button');
                button.addEventListener('click', onButton);
                button.classList.remove('hidden');
                const container = document.querySelector('#result');
                container.appendChild(title);
                container.appendChild(contents);
                
            }
        }     
    }else{
        for(let i in RESULTS_MAP){
            if(i === q1){
                const title = document.createElement('h1');
                const contents = document.createElement('p');
                title.textContent = RESULTS_MAP[i].title;
                contents.textContent = RESULTS_MAP[i].contents;
                const button = document.querySelector('#button');
                button.addEventListener('click', onButton);
                button.classList.remove('hidden');
                const container = document.querySelector('#result');
                container.appendChild(title);
                container.appendChild(contents);
                
            }
        }
    }
}

function onButton(){

    const allBoxes = document.querySelectorAll('.choice-grid div');

    for(const box of allBoxes){
        box.classList.remove('opacita');
        const check = box.querySelector('.checkbox');
        check.src = 'images/unchecked.png';
        box.classList.remove('coloresfondo');
            
        box.addEventListener('click', checked);
        const res = document.querySelector('#result');
        res.innerHTML = '';
        const button = document.querySelector('#button');
        button.classList.add('hidden');
    } 
    const svuotaRicetta = document.querySelector('#ricetta-view');
    svuotaRicetta.innerHTML = '';

    const svuotaPodcast = document.querySelector('#spotify-view');
    svuotaPodcast.innerHTML = '';
}


function onJson(json){
    console.log('json ricevuto');
    console.log(json);
    const ricetta = document.querySelector('#ricetta-view');
    ricetta.innerHTML = '';
    const results = json.hits;
    const num_results = results.length;
    for(let i=0; i<num_results; i++){
        const recipe_data = results[i];
        const titolo = recipe_data.recipe.label;
        const immagine = recipe_data.recipe.image;
        const recipe = document.createElement('div');
        recipe.classList.add('ric');
        const img = document.createElement('img');
        img.src = immagine;
        const caption = document.createElement('span');
        caption.textContent = titolo;
        recipe.appendChild(caption);
        recipe.appendChild(img);
        const ingredienti = recipe_data.recipe.ingredientLines;
        const num_ingredienti = ingredienti.length;
        for(let j=0; j<num_ingredienti; j++){
            const ingr = ingredienti[j];
            const caption_ingr = document.createElement('p');
            caption_ingr.textContent = ingr;
            recipe.appendChild(caption_ingr);
        }
        ricetta.appendChild(recipe);
    }
}

function onResponse(response){
    if(!response.ok){
        console.log('Risposta non valida');
        return null;
    }else{
        console.log('Risposta ricevuta');
        return response.json();
    }
}

function onFail(fail){
    console.log('Errore: ' + fail);
}

function funcJson(json){
    console.log('altro json ricevuto');
    console.log(json);
    const library = document.querySelector('#spotify-view');
    library.innerHTML = '';
    const results = json.episodes.items;
    const num_results = results.length;
    for(let i=0; i<num_results; i++){
        const library_data = results[i];
        const title = library_data.description;
        const url = library_data.external_urls.spotify;
        const container = document.createElement('div');
        container.classList.add('spot');
        const titolo = document.createElement('span');
        titolo.textContent = title;
        const url_descr = document.createElement('a');
        url_descr.href = url;
        const image = document.createElement('img');
        image.src = library_data.images[1].url;
        container.appendChild(titolo);
        url_descr.appendChild(image);
        container.appendChild(url_descr);
        library.appendChild(container);
    }

}

function search(event){
    event.preventDefault();
    const ricetta_input = document.querySelector('#ricetta');
    const ricetta_value = encodeURIComponent(ricetta_input.value);
    console.log('Eseguo ricerca: ' + ricetta_value);
    rest_url = 'https://api.edamam.com/search?q=' + ricetta_value + '&app_id=' + api_id + '&app_key=' + api_key;
    console.log('URL: ' + rest_url);
    fetch(rest_url).then(onResponse, onFail).then(onJson);
}

function onClick(event){
    event.preventDefault();
    const podcastValue = 'GialloZafferano: le Ricette';

    fetch("https://api.spotify.com/v1/search?q=" + podcastValue + "&type=episode&limit=30&offset=0&market=IT",
    {
        headers: 
        {
            'Authorization': 'Bearer ' + token
        }
    }
    ).then(onResponse, onFail).then(funcJson);
}

function onTokenResponse(response){
    console.log('Risposta ricevuta');
    return response.json();
}

function onTokenJson(json){
    console.log('Token preso');
    console.log(json);
    token = json.access_token;
}

const client_id = 'ccf23884d60d45a5a60ddaec87026e2e';
const client_secret = 'c37b9d4c366d44a181662be082d77444';

fetch("https://accounts.spotify.com/api/token", 
{
    method: 'post',
    body: 'grant_type=client_credentials',
    headers: 
    {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
    }
}   
).then(onTokenResponse).then(onTokenJson);


let q1 = null;
let q2 = null;
let q3 = null;

const img_check = document.querySelectorAll('.choice-grid div');    
for(const imgs of img_check){
    imgs.addEventListener('click', checked);
}

const api_key = '55a23f27021b93378b1b779f1ee257da';
const api_id = 'a17b53ed';
const form = document.querySelector('form');
form.addEventListener('submit', search);


let token;
const spot = document.querySelector('#spot');
spot.addEventListener('click', onClick);




