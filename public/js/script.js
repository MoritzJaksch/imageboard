(function() {
    Vue.component("some-component", {
        template: "#my-template",
        props: ["imageId"],
        data: function() {
            return {
                heading: "catnip's first vue component",
                image: [],
                commentform: {
                    username: "",
                    comment: ""
                },
                comments: []
            };
        },

        mounted: function() {
            var self = this;
            console.log("component mounted");
            axios
                .get("/get-modal", {
                    params: {
                        id: self.imageId
                    }
                })
                .then(function(res) {
                    self.image = res.data[0].rows;
                    self.comments = res.data[1].rows;
                    console.log("THIS IS AN IMAGE: ", res.data[0].rows);
                    console.log("THIS IS A COMMENT: ", res.data[1].rows);
                    console.log(
                        "THESE ARE THE COMMENTS: ",
                        self.comments[0].username
                    );
                });

            //axios request to server looking for information on the server where ID = imageId
            //in the end join query with comment data base to also get comments on the pictures.
        },
        methods: {
            closeComponent: function() {
                console.log("X CLICKED");
                this.$emit("close-component");
            },
            handleClick: function() {
                console.log("Clicked!");
            },
            postComment: function() {
                var self = this;
                axios
                    .post("/comment", {
                        user: this.commentform.username,
                        comment: this.commentform.comment,
                        id: this.imageId
                    })
                    .then(function(result) {
                        console.log("THESE ARE COMMENT: ", result);
                    });
                console.log("CHAT WORKING!!!!");
            }
        }
    });

    new Vue({
        el: "#main",
        data: {
            name: "moe",

            imagesArr: [],

            imageId: 0,
            // image: [],
            //should equal the id of the picture that was clicked on

            showComponent: false,

            form: {
                title: "",
                description: "",
                username: "",
                file: null
            }
        },

        mounted: function() {
            var self = this;
            console.log("mounted run");
            axios.get("/get-images").then(function(res) {
                console.log("RES DATA: ", res.data);
                self.imagesArr = res.data;
                console.log("IMAGES ARR: ", self.imagesArr);
            });
        },
        methods: {
            closingComponent: function() {
                this.imageId = 0;
            },
            toggleComponent: function(e) {
                console.log("ID: ", e.target.id);
                //change db query to return id
                // this.image = e.target.src;
                this.imageId = e.target.id;
            },
            handleFileChange: function(e) {
                console.log("handleFileChange running!", e.target.files[0]);
                this.form.file = e.target.files[0];
            },
            uploadFile: function(e) {
                var self = this;
                e.preventDefault();
                console.log("this: ", this.form);
                var formData = new FormData();
                formData.append("file", this.form.file);
                formData.append("title", this.form.title);
                formData.append("description", this.form.description);
                formData.append("username", this.form.username);

                axios.post("/upload", formData).then(function(res) {
                    console.log("FRONTEND res: ", res);
                    self.imagesArr.unshift(res.data.rows[0]);
                    console.log("res: ", res);
                });
            }
        }
    });
})();
