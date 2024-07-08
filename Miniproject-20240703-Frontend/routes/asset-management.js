let router = require('express').Router();

// amm
// 자산관리 메인 페이지
router.get('/', async function (req, res) {
    res.render('amm/management.ejs');
});

// 자산관리 입금 폼
router.get('/deposit', async function (req, res) {
    res.send('/amm/deposit 폼 입니다.');
});

// 자산관리 입금 처리
router.post('/deposit/submit', async function (req, res) {
    res.send('입금이 처리 되는 곳');
});

// 자산관리 송금 폼
router.get('/transfer', async function (req, res) {
    res.send('/amm/transfer 폼 입니다.');
});

// 자산관리 송금 처리
router.post('/transfer/submit', async function (req, res) {
    res.send('송금이 처리 되는 곳');
});

module.exports = router;