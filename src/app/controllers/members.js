const { age, date } = require("../../lib/utils")
const Member = require("../models/Member")

module.exports = {
    index(req, res){
        
        Member.all(function(members){

            return res.render("members/index", { members } )
        
        })
    },

    show(req, res){
        
        Member.find(req.params.id, function(member){
            
            if(!member) return res.send('Member not found!')

            member.birth = date(member.birth).birthDay

            return res.render("../views/members/show", { member } )

        })

    },

    create(req, res){
        
        Member.instructorSelectOptions(function(option){

            return res.render("members/create", { option })

        })


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

        Member.create(data, function(member){

            return res.redirect(`/members/${member.id}`)

        })

    },

    edit(req, res){
        
        Member.find(req.params.id, function(member){
            
            if(!member) return res.send('Member not found!')

            member.birth = date(member.birth).iso

            Member.instructorSelectOptions(function(option){

                return res.render("../views/members/edit", { member, option } )
    
            })
            

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

        Member.update(data, function(){

            return res.redirect(`/members/${req.body.id}`)

        })

    },

    delete(req, res){
        
        Member.delete(req.body.id, function(){
            
            return res.redirect("/members")
            
        })

    }

}