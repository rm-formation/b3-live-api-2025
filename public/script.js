const formConnection = document.querySelector('#formConnection');
const mainSection = document.querySelector('main > section');
const logoutBtn = document.querySelector('.logoutBtn');

async function checkConnection() {
    const response = await fetch('http://localhost:3000/user/checkConnection');
    if (response.status === 200) {
        setConnectionState(true);
    }
}

checkConnection();

function setConnectionState(connectionOK) {
    document.body.classList.toggle("connectionOK", connectionOK);
    if (connectionOK) {
        initMain();
    }
}

formConnection.addEventListener('submit', async e => {
    e.preventDefault();

    const formData = new FormData(formConnection);

    const bodyObject = Object.fromEntries(formData.entries());

    const response = await fetch('http://localhost:3000/user/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        // credentials: 'include',
        body: JSON.stringify(bodyObject)
    });

    setConnectionState(response.status === 200);
});

logoutBtn.addEventListener('click', async () => {
    await fetch('http://localhost:3000/user/signout', { method: "POST" });
    setConnectionState(false);
});

let pokemons = [];

async function initMain() {
    mainSection.innerHTML = '';
    const pokemonsReponses = await fetch('http://localhost:3000/pokemon', {
        // credentials: 'include'
    });
    pokemons = await pokemonsReponses.json();
    pokemons.forEach(p => {
        const div = document.createElement("div");
        div.classList.add("pokemon");
        div.innerHTML = `
            <h3>${p.name}</h3>
            <div>Num : ${p.pokemonNumber}</div>
            <div>Level : ${p.level}</div>
        `;
        mainSection.append(div);
    });
}

