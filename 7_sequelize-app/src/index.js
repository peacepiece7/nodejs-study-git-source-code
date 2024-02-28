const express = require('express');
const db = require('./models');
const app = express();

const User = db.users;

// db.sequelize.sync({force: true}).then(() => {
//     console.log('데이터베이스 drop 및 sync를 다시 맞춤.')
// })

app.use(express.json());

app.post('/users', (req, res) => {
    const { firstName, lastName, hasCar } = req.body;

    const user = {
        firstName,
        lastName,
        hasCar
    }

    User.create(user)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || '유저를 생성하는데 에러가 발생했습니다.'
            })
        })
})

app.get("/users", (req, res) => {

    User.findAll()
        .then(users => {
            res.send(users);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || '유저 정보를 가져오는데 실패했습니다.'
            })
        })
})

app.get("/users/:id", (req, res) => {
    const id = req.params.id;
    User.findByPk(id)
        .then(user => {
            if (user) {
                res.send(user);
            } else {
                res.status(404).send({
                    message: `id가 ${id}인 유저가 없습니다.`
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || `${id}인 유저를 찾는데 에러가 났습니다.`
            })
        })
})


app.put("/users/:id", (req, res) => {

    const id = req.params.id;
    User.update(req.body, {
        where: { id }
    })
        .then(result => {
            if (result == 1) {
                res.send('성공했습니다.');
            } else {
                res.send(`${id}에 맞는 유저가 없습니다.`);
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || `${id}인 유저를 업데이트 시 에러가 났습니다.`
            })
        })

})

app.delete('/users/:id', (req, res) => {
    const id = req.params.id;
    User.destroy({
        where: { id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "유저가 성공적으로 삭제되었습니다."
                })
            } else {
                res.send({
                    message: `${id} 유저를 찾지 못했습니다.`
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || `${id} 유저를 삭제하는데 실패했습니다.`
            })
        })
})



const PORT = 4000;
app.listen(PORT, () => {
    console.log('4000번 포트에서 서버가 실행되었습니다.')
})