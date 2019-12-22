const express = require('express')
const router = express.Router()

/* 
 *GET pages index
 */


router.get('/', (req, res) => {
    res.send('admin area')
})


/* 
 *GET add page
 */

router.get('/add-page', (req, res) => {
    var title = ''
    var slug = ''
    var content = ''

    res.render('admin/add_page', {
        title: title,
        slug: slug,
        content: content
    })
})


/* 
 *POST add page
 */

router.post('/add-page', (req, res) => {

    req.checkBody('title', 'Title must have a value.').notEmpty()
    req.checkBody('content', 'Content must have a value.').notEmpty()

    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase()
    if (slug == "") slug = title.replace(/\s+/g, '-').toLowerCase()
    var content = req.body.content;

    var errors = req.validationErrors()

    if (errors) {
        // console.log(errors);
        res.render('admin/add_page', {
            errors: errors,
            title: title,
            slug: slug,
            content: content
        })
    } else {
        console.log('success');
    }
})


// Exports
module.exports = router