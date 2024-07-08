let router = require('express').Router();
const multer = require('multer');
const fs = require('fs'); // fs.existsSync와 fs.mkdirSync를 사용하여 경로가 없을 때만 폴더를 생성합니다.
const path = require('path');


// 리스트 검색
router.get('/search', async function (req, res) {
    let req_sword = encodeURIComponent(req.query.sword);
    let req_selectv = req.query.selectv;
    try {
        const response = await fetch(`http://127.0.0.1:8000/real-estate/search?selectv=${req_selectv}&sword=${encodeURIComponent(req_sword)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'sessionuser': req.session.user.userid,
                'req_selectv': req_selectv,
                'req_sword': req_sword
            },
        });
        const data = await response.json();
        console.log(data);
        // 요청 성공 여부에 따라 렌더링할 데이터와 함께 렌더링
        return res.render('real-estate/list.ejs', { data, user: req.session.user });
    } catch (error) {
        console.error(error);
        // 오류 처리
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})



// 부동산 매물 목록
router.get('/', async function (req, res) {
    try {
        const response = await fetch('http://127.0.0.1:8000/real-estate', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'sessionuser': req.session.user.userid
            },
        });
        const data = await response.json();

        // 요청 성공 여부에 따라 렌더링할 데이터와 함께 렌더링
        return res.render('real-estate/list.ejs', { data, user: req.session.user });
    } catch (error) {
        console.error(error);
        // 오류 처리
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 부동산 매물 등록 폼
router.get('/enter', function (req, res) {
    res.render('real-estate/enter.ejs', { user: req.session.user });
});

// 이미지를 저장할 경로 설정
const uploadPath = './public/image';

// 경로가 없으면 자동으로 생성하는 함수
const createUploadPathIfNotExists = () => {
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }
};

// 먼저 경로를 생성해줍니다.
createUploadPathIfNotExists();

const storage = multer.diskStorage({
    destination: (req, file, done) => {
        done(null, './public/image'); // 이미지를 저장할 경로
    },
    filename: (req, file, done) => {
        done(null, file.originalname); // 파일명은 원본 파일명으로 설정
    }, limit: 5 * 1024 * 1024 // 5MB 제한
});

const upload = multer({ storage });

let imagepath = ''; // 이미지 경로를 저장할 변수

router.post('/photo', upload.single('imagepath'), (req, res) => {
    // 이미지 업로드 시 저장된 파일의 경로를 변수에 저장
    imagepath = req.file.originalname; // 실제 이미지 파일의 저장 경로를 변수에 저장
});

router.post('/save', async function (req, res) {
    try {
        const response = await fetch('http://127.0.0.1:8000/real-estate/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...req.body,
                sessionuser: req.session.user,
                imagepath: imagepath // 이미지 경로를 포함시킴
            })
        });
        const data = await response.json();
        if (response.ok) {
            return res.redirect('/real-estate/?alertMsg=매물 등록이 완료되었습니다.');
        } else {
            return res.render('real-estate/enter.ejs', { data, user: req.session.user });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ alertMsg: '서버 오류가 발생했습니다.' });
    }
});



// 부동산 매물 수정 Submit
router.post('/edit', async function (req, res) {
    imagepath = req.body.imagepath;
    try {
        const response = await fetch('http://127.0.0.1:8000/real-estate/edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...req.body,
                sessionuser: req.session.user,
                imagepath: imagepath // 이미지 경로를 포함시킴
            })
        });

        const data = await response.json();
        if (response.ok) {
            return res.redirect('/real-estate/?alertMsg=수정이 완료되었습니다.');
        } else {
            return res.render('real-estate/list.ejs', { data, user: req.session.user });
        }
    } catch (error) {
        console.error(error);
    }
});

// 부동산 매물 전세가 구매 Submit
router.post('/jeonse', async function (req, res) {
    res.send('/real-estate/jeonse 입니다.');
});

module.exports = router;