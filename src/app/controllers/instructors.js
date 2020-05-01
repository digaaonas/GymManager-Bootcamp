const { age, date } = require("../../lib/utils")
const Instructor = require("../models/Instructor")

module.exports = {
    index(req, res){
        
        let { filter, limit, page } = req.query

        limit = limit || 2
        page = page || 1
        
        let offset = limit * (page - 1)

        const params = {
            filter,
            limit,
            page,
            offset,
            callback(instructors){

                const pagination = {
                    filter,
                    total,
                    page
                }

                return res.render("instructors/index", { instructors, filter } )   
            }
        }

        Instructor.paginate(params)
        
    },

    show(req, res){
        
        Instructor.find(req.params.id, function(instructor){
            
            if(!instructor) return res.send('Instructor not found!')

            instructor.age = age(instructor.birth)
            instructor.services = instructor.services.split(",")
            instructor.create_at = date(instructor.create_at).format

            return res.render("../views/instructors/show", { instructor } )

        })

    },

    create(req, res){
        
        return res.render("instructors/create")

    },

    post(req, res){
       
        const keys = Object.keys(req.body)

        for(key of keys){
            if(req.body[key] == "")
            return res.send('Please, fill all fiels')
        }

        const data = {            
            
            ...req.body,
            birth: date(req.body.birth).iso,
            create_at: date(Date.now()).iso,

        }

        Instructor.create(data, function(instructor){

            return res.redirect(`/instructors/${instructor.id}`)

        })

    },

    edit(req, res){
        
        Instructor.find(req.params.id, function(instructor){
            
            if(!instructor) return res.send('Instructor not found!')

            instructor.birth = date(instructor.birth).iso
            
            return res.render("../views/instructors/edit", { instructor } )

        })

    },

    put(req, res){
        
        const keys = Object.keys(req.body)

        for(key of keys){
            if(req.body[key] == "")
            return res.send('Please, fill all fiels')
        }
        
        const data = {
            ...req.body,
            birth: date(req.body.birth).iso

        }

        Instructor.update(data, function(){

            return res.redirect(`/instructors/${req.body.id}`)

        })

    },

    delete(req, res){
        
        Instructor.delete(req.body.id, function(){
            
            return res.redirect("/instructors")
            
        })

    }

}