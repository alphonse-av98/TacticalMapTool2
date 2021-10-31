window.addEventListener('DOMContentLoaded', function () {

    const ga_disable = 'ga-disable-G-CH0XHZKRC1';
    const ga_cookie = localStorage.getItem('ga_cookie_opt_in');

    if (ga_cookie == 'no') {
        // GAを無効にする
        window[ga_disable] = true;
    } else if (ga_cookie == 'yes') {
        // GAを有効にする
        window[ga_disable] = false;
    } else {
        // GAを無効にする
        window[ga_disable] = true;
        // 利用規約同意のPopupを表示
        $('.optin-popup').fadeIn();
    }
});

$('#accept').click(function () {
    localStorage.setItem('ga_cookie_opt_in', 'yes');
    $('.optin-popup').fadeOut();
});

$('#acceptGaOptout').click(function () {
    localStorage.setItem('ga_cookie_opt_in', 'no');
    $('.optin-popup').fadeOut();
})

$('#deny').click(function () {
    window.location.href = 'https://google.com';
});