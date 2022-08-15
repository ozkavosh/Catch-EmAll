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

const showPwd = (e) => {
    if(!e.target.matches(".showPwdBtn")) return;
    const type = e.target.previousElementSibling.getAttribute('type');

    if(type === 'text'){
        e.target.previousElementSibling.setAttribute('type','password');
        e.target.classList.replace("bi-eye-slash","bi-eye");
    }else{
        e.target.previousElementSibling.setAttribute('type','text');
        e.target.classList.replace("bi-eye","bi-eye-slash");
    }   
}

document.addEventListener('click', (e) => {
    swapMode(e);
    showPwd(e);
});

document.addEventListener('submit', (e) => {
    login(e);
    register(e);
})