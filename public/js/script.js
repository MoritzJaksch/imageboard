(function() {
    new Vue({
        el: "#main",
        data: {
            imagesArr: [],
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
                self.imagesArr = res.data;
            });
        },
        methods: {
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
