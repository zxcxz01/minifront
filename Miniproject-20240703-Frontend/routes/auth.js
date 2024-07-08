let router = require('express').Router();

// 로그인 폼
router.get('/login', function (req, res) {
    if (!req.session.user) {
        return res.render('auth/login.ejs');
    }
    
    res.redirect('/');
});

// 로그인
router.post('/login', async function (req, res) {
    try {
        const response = await fetch('http://127.0.0.1:8000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });
        
        const data = await response.json();
        if (response.ok) {
            req.session.user = { userid: req.body.userid };
            res.cookie('uid', req.body.userid);
            return res.render('index.ejs', { user: req.session.user, data });  // 로그인 성공
        } else {
            return res.render('auth/login.ejs', { data });  // 로그인 실패
        }
    } catch (error) {
        console.error(error);
    }
});

// 로그아웃
router.get('/logout', function (req, res) {
    req.session.destroy();
    res.clearCookie('uid', { path: '/' });
    res.redirect('/');
});

// 회원가입 폼
router.get('/sign-up', function (req, res) {
    res.render('auth/sign-up.ejs');
});

// 회원가입 폼에서 중복 아이디 검사
router.post('/check-id', async function (req, res) {
    try {
        const response = await fetch('http://127.0.0.1:8000/auth/check-id', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });
        
        const data = await response.json();
        return res.json(data);
    } catch (error) {
        console.error(error);
    }
});

// 회원가입 - 유저 등록
router.post('/sign-up', async function (req, res) {
    try {
        const response = await fetch('http://127.0.0.1:8000/auth/sign-up', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        if (response.ok) {
            req.session.user = { userid: req.body.userid };
            res.cookie('uid', req.body.userid);
            return res.render('index.ejs', { user: req.session.user, data });  // 회원가입 완료
        } else {
            return res.render('auth/sign-up.ejs', { data });  // 회원가입 실패
        }
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;