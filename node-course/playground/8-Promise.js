const { resolve } = require("path")

const add = ((a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(a + b)
        }, 2000)
    })
})

// add(5, 8).then((sum) => {
//     console.log(sum)
// }).catch((e) => {
//     console.log(e)
// })

add(5,7).then((sum) => {
    console.log(sum)
    return add(sum, 9)
}).then((sum2) => {
    console.log(sum2)
}).catch((e) => {
    console.log(e)
})
