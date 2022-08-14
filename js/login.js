const loader = document.querySelector(".loaderBg");

const swapMode = (e) => {
    if(!e.target.dataset.mode) return;
    if(e.target.dataset.mode === "login"){
        location.href = "./newAccount.html";
    }else{
        location.href = "./login.html";
    }
}

const login = async (e) => {
    if(!e.target.matches(".loginForm")) return;
    e.preventDefault();
    const { email, password } = e.target;
    loader.classList.toggle('dNone');
    try{
        const request = await axios.post('https://ch-simple-login.glitch.me/api/login', { email: email.value, password: password.value});
        const { token } = request.data;
        sessionStorage.setItem('token', token);
        location.href = "./index.html";
    }catch{
        document.querySelector('dialog').showModal();
    }
    loader.classList.toggle('dNone');
}

const register = async (e) => {
    if(!e.target.matches(".registerForm")) return;
    e.preventDefault();
    const { username, email, password } = e.target;
    loader.classList.toggle('dNone');
    try{
        const request = await axios.post('https://ch-simple-login.glitch.me/api/register', { username: username.value, email: email.value, password: password.value});
        location.href = "./login.html";
    }catch{
        document.querySelector('dialog').showModal();
    }
    loader.classList.toggle('dNone');
}

document.addEventListener('click', (e) => {
    swapMode(e);
});

document.addEventListener('submit', (e) => {
    login(e);
    register(e);
})