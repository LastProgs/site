/*---МОДАЛЬНОЕ ОКНО-----------------------------------*/
const popupLinks = document.querySelectorAll('.popup_links');
const popup = document.getElementById('popup');
const popupBody = document.querySelector('.popup_body');
let N=0;

if (popupLinks.length>0) {
    for (let index = 0; index < popupLinks.length; index++) {
        const open = popupLinks[index];
        open.addEventListener('click', function(e){
            const popupName = open.getAttribute('href').replace('#','');
            const currentPopup = document.getElementById(popupName);
            popupBodyOpen(currentPopup);
            if (popupName == "popup6") {
                N++;
            }
            e.preventDefault();
        })
    }
}

function popupBodyOpen(currentPopup){
    const popupActive = document.querySelector('.popup.active');
    if (popupActive){
        popupClose(popupActive);
    }
    if (currentPopup) {
        currentPopup.classList.add('active');
        document.body.classList.add('_lock');
        currentPopup.addEventListener('click', function(e){
            if (!e.target.closest('.popup_body')) {
                popupClose(currentPopup);
                e.preventDefault();
            }
        })
    }
}

const closePopup = document.querySelectorAll('.close');
if (closePopup.length > 0) {
    for (let index = 0; index < closePopup.length; index++) {
        const el = closePopup[index];
        el.addEventListener('click', function(e){
            popupClose(el.closest('.popup'));
            e.preventDefault();
        })
    }
}
function popupClose(popupActive){
    popupActive.classList.remove('active');
    document.body.classList.remove('_lock');
    //очистка полей
    if (N > 0) {
        const reset = document.querySelectorAll('._req');
        for (let index = 0; index < reset.length; index++) {
            reset[index].value = "";
            reset[index].classList.remove('_error');
        }
    }
    document.querySelector('.checkbox').classList.remove('_error');
    document.querySelector('.file_input').value = "";
    document.getElementById('formPreview').innerHTML = ``;
}
/*-------------------------------------------------*/
/* Плавное перемещение к объекту*/
const MenuLinks = document.querySelectorAll('.nl[data-goto]');
if (MenuLinks.length > 0) {
    MenuLinks.forEach(MenuLinks => {
        MenuLinks.addEventListener("click", onMenuLinkClick);
    });
    function onMenuLinkClick(e) {
        const MenuLinks = e.target;
        if (MenuLinks.dataset.goto && document.querySelector(MenuLinks.dataset.goto)) {
            const gotoBlock = document.querySelector(MenuLinks.dataset.goto);
            const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset - document.querySelector('.header').offsetHeight;
            window.scrollTo({
                top: gotoBlockValue,
                behavior: "smooth"
            });
            e.preventDefault();
        }
    }
}
/*-------------------------------------------------*/

/* Бургер меню*/
const navIcon = document.querySelector('.nav_icon');
if (navIcon){
    const navBar = document.querySelector('.nav_bar');
    navIcon.addEventListener('click', function(e){
        document.body.classList.toggle('_lock')
        navIcon.classList.toggle('_active');
        navBar.classList.toggle('_active');
    })
}
/* Закрытие меню через кнопки */
function del_active(){
    const navBar = document.querySelector('.nav_bar');
    const navIcon = document.querySelector('.nav_icon');
    navIcon.classList.remove('_active');
    navBar.classList.remove('_active');
    document.body.classList.remove('_lock')
}
/*-------------------------------------------------*/
/* Проверка устройства ПК или телефон */
const isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return (
            isMobile.Android() ||
            isMobile.BlackBerry() ||
            isMobile.iOS() ||
            isMobile.Opera() ||
            isMobile.Windows());
    }

};

if (isMobile.any()) {
    document.body.classList.add('_touch');
    document.querySelector('.footer').classList.add('_touch');
    document.querySelector('.about').classList.add('_touch');
    document.querySelector('.main_info').classList.remove('q');
    document.querySelector('.footer_touch').classList.add('_touch');
    document.querySelector('.about_touch').classList.add('_touch');
    document.querySelector('.about_touch').classList.add('_info');
}else{
    document.body.classList.add('_pc');
    document.querySelector('.footer').classList.add('_pc');
    document.querySelector('.footer').classList.remove('_touch');
    document.querySelector('.about').classList.remove('_touch');
    document.querySelector('.about_touch').classList.remove('_info');
    document.querySelector('.main_info').classList.add('q');
}
/*----ОБРАБОТКА ФОРМЫ------------------------------------*/
"use strict"

document.addEventListener('DOMContentLoaded', function() {

    const form = document.getElementById('form');

    form.addEventListener('submit', formSend);

    async function formSend(e) {
        e.preventDefault();

        let error = formValidate(form);
        let formData = new FormData(form);
        formData.append('image', formImage.files[0]);

        if (error === 0) {
            openWrapp(wrapper);

            let response = await fetch('sendmail.php', {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                let result = await response.json();
                alert(result.message);
                formPreview.innerHTML = '';
                form.reset();
                closeWrapp(wrapper);
                alert('отправлено');
            } else {
                //сообщение об ошибке
                alert('ошибка');
                closeWrapp(wrapper);
            }

        } else {
            /*--------------вывод сообщения о неверном заполнении-----------------*/
            alert('Заполните обязательные поля');
        }

    }


    function formValidate(form) {
        let error = 0;
        let formReq = document.querySelectorAll('._req');

        for (let index = 0; index < formReq.length; index++) {
            const input = formReq[index];
            formRemoveError(input);

            if (input.classList.contains('_email')) {
                    if (emailTest(input)) {
                        formAddError(input);
                        error++;}
                    } else if (input.getAttribute("type") === "checkbox" && input.checked === false) {
                        formAddError(input);
                        error++;
                } else {
                    if (input.value === '') {
                        formAddError(input);
                        error++;
                    }
                }

        }
        return error;
    }

    function formAddError(input) {
        input.parentElement.classList.add('_error');
        input.classList.add('_error');
    }
    function formRemoveError(input) {
        input.parentElement.classList.remove('_error');
        input.classList.remove('_error');
    }

    /*Функция проверки EMAIL*/
    function emailTest(input) {
        return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
    }

    /*Получаем input file в переменную*/
    const formImage = document.getElementById('formImage');
    const formPreview = document.getElementById('formPreview');

    formImage.addEventListener('change', () => {
        uploadFile(formImage.files[0]);
    })

    function uploadFile(file) {
        //проверяем тип файла
        if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
            //надпись при неверном расширении файла
            formImage.value = '';
            return;
        }
        //проверка размера файла
        if (file.size > 2 * 1024 * 1024) {
            //надпись при неверном размере файла >2мб
            return;
        }

        var reader = new FileReader();
        reader.onload = function (e) {
            formPreview.innerHTML = `<img src="${e.target.result}" alt="фото">`;
        };
        reader.onerror = function (e) {
            //надпись при ошибке
            alert('Ошибка загрузки');
        };
        reader.readAsDataURL(file);
    }
});

//покрывало загрузки
const wrapper = document.querySelector('.form_button');
const popupWrap = document.querySelector('.formval');
const formWrap = document.querySelector('.form');
const popup_back = document.getElementById('popup6');
function openWrapp(wrapper) {
    wrapper.classList.add('_sending');
    popupWrap.classList.add('_sending');
    formWrap.classList.add('_sending');
    popup_back.classList.add('_sending');
}

function closeWrapp(wrapper) {
    wrapper.classList.remove('_sending');
    popupWrap.classList.remove('_sending');
    formWrap.classList.remove('_sending');
    popup_back.classList.remove('_sending');
}
//Анимированное появление объектов
const animItems = document.querySelectorAll('._anim_items');

if (animItems.length > 0) {
    window.addEventListener('scroll', animOnScroll);
    function animOnScroll() {
        for (let index = 0; index < animItems.length; index++) {
            const animItem = animItems[index];
            const animItemHeight = animItem.offsetHeight;
            const animItemOffset = offset(animItem).top;
            const animStart = 4;

            let animItemPoint = window.innerHeight - animItemHeight / animStart;
            if (animItemHeight > window.innerHeight) {
                animItemPoint = window.innerHeight - window.innerHeight / animStart;
            }

            if ((scrollY > animItemOffset - animItemPoint) && scrollY < (animItemOffset + animItemHeight)) {
                animItem.classList.add('_show');
            } else {
                if (!animItem.classList.contains('_anim_no_hight')) {
                    animItem.classList.remove('_show');
                }


            }
        }
    }
    //функция поиска высоты окна
    function offset(el) {
        const rect = el.getBoundingClientRect(),
        scrollLeft = window.scrollY || document.documentElement.scrollLeft,
        scrollTop = window.scrollY || document.documentElement.scrollTop;

        return { top: rect.top + scrollTop, left: rect.left + scrollLeft }

    }

    setTimeout(() => {
        animOnScroll();
    }, 200);
}



