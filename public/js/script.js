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
                comments: [],
                hashes: [],
                nextId: "",
                prevId: "",
                hashClicked: false,
                hashedPics: [],
                hashtag: ""
            };
        },
        watch: {
            imageId: function() {
                if (isNaN(this.imageId)) {
                    console.log("returning");
                    return;
                } else {
                    console.log("elsing");
                    var self = this;
                    console.log("watcher running!", this.imageId);
                    axios
                        .get("/get-modal", {
                            params: {
                                id: self.imageId
                            }
                        })
                        .then(function(res) {
                            self.image = res.data[0].rows;
                            self.comments = res.data[1].rows;
                        });
                }
            }
        },

        mounted: function() {
            var self = this;
            axios
                .get("/get-modal", {
                    params: {
                        id: self.imageId
                    }
                })
                .then(function(res) {
                    console.log("RES DATA from get modal: ", res.data);

                    self.image = res.data[0].rows;
                    self.comments = res.data[1].rows;
                    self.hashes = res.data[2].rows;
                    self.nextId = self.image[0].prev_id;
                    self.prevId = self.image[0].next_id;
                    console.log("nextID: ", self.nextId);
                    console.log("prevID: ", self.prevId);
                    //
                    console.log("IMAGE DESCRIPTION?!", self.image);
                });

            //axios request to server looking for information on the server where ID = imageId
            //in the end join query with comment data base to also get comments on the pictures.
        },
        methods: {
            checkHashes: function(e) {
                this.hashtag = e.target.innerHTML;
                this.hashClicked = true;
                console.log("HASH ID: ", e.target.innerHTML);
                var self = this;
                axios
                    .get("/get-hashes", {
                        params: { id: e.target.innerHTML }
                    })
                    .then(result => {
                        result.data.forEach(function(id) {
                            axios
                                .get("/get-hashed-pictures", {
                                    params: { id: id.img_id }
                                })
                                .then(function(res) {
                                    self.hashedPics.push(res.data[0]);
                                });
                            console.log(id.img_id);
                        });

                        console.log("hashes checked", result);
                        console.log(
                            "THESE ARE THE NEW PICS: ",
                            self.hashedPics
                        );
                    });
            },
            prevPicture: function() {
                var self = this;

                axios
                    .get("/get-modal", {
                        params: {
                            id: self.image[0].prev_id
                        }
                    })
                    .then(function(res) {
                        console.log("RES DATA prev_id: ", res.data);

                        self.image = res.data[0].rows;
                        self.comments = res.data[1].rows;
                        self.hashes = res.data[2].rows;
                        self.nextId = self.image[0].prev_id;
                        self.prevId = self.image[0].next_id;
                        console.log("nextID: ", self.nextId);
                        console.log("prevID: ", self.prevId);
                    });
            },
            nextPicture: function() {
                var self = this;
                // self.nextId = self.image[0].prev_id;
                // self.prevId = self.image[0].next_id;

                axios
                    .get("/get-modal", {
                        params: {
                            id: self.image[0].next_id
                        }
                    })
                    .then(function(res) {
                        console.log("RES DATA prev_id: ", res.data);

                        self.image = res.data[0].rows;
                        self.comments = res.data[1].rows;
                        self.hashes = res.data[2].rows;
                        self.nextId = self.image[0].prev_id;
                        self.prevId = self.image[0].next_id;
                        console.log("nextID: ", self.nextId);
                        console.log("prevID: ", self.prevId);
                    });
            },
            nextPictureHash: function(e) {
                this.hashClicked = false;

                var self = this;
                // self.nextId = self.image[0].prev_id;
                // self.prevId = self.image[0].next_id;

                axios
                    .get("/get-modal", {
                        params: {
                            id: e.target.id
                        }
                    })
                    .then(function(res) {
                        console.log("RES DATA prev_id: ", res.data);

                        self.image = res.data[0].rows;
                        self.comments = res.data[1].rows;
                        self.hashes = res.data[2].rows;
                        self.nextId = self.image[0].prev_id;
                        self.prevId = self.image[0].next_id;
                        console.log("nextID: ", self.nextId);
                        console.log("prevID: ", self.prevId);
                    });
            },
            closeComponent: function() {
                this.$emit("close-component");
            },
            handleClick: function() {},
            postComment: function() {
                var self = this;
                axios
                    .post("/comment", {
                        user: this.commentform.username,
                        comment: this.commentform.comment,
                        id: this.imageId
                    })
                    .then(function(res) {
                        self.comments.push(res.data.rows[0]);
                        self.commentform = {};
                    });
            }
        }
    });

    new Vue({
        el: "#main",
        data: {
            name: "moe",
            hovered: "",
            likes: 0,
            imagesArr: [],
            imagesId: [],
            morePics: true,
            foodshow: "",
            imageId: location.hash.slice(1) || 0,
            // image: [],
            //should equal the id of the picture that was clicked on
            blurry: true,
            showComponent: false,

            form: {
                title: "",
                description: "",
                username: "",
                file: null,
                hash: ""
            }
        },

        mounted: function() {
            var self = this;
            window.addEventListener("hashchange", function() {
                console.log("HASH HAS CHANGED!!!!!!!!", location.hash.slice(1));
                var including = location.hash.slice(1);

                console.log(
                    "DOES INCLUDE? ",
                    self.imagesId,
                    self.imagesId.includes(including)
                );
                // if (self.imagesId.includes(location.hash.slice(1))) {
                self.imageId = location.hash.slice(1);
                // } else {
                // return;
                // }

                //
            });

            axios.get("/get-images").then(function(res) {
                self.imagesArr = res.data;
                console.log("res data: ", res.data);
                for (var i = 0; i < res.data.length; i++) {
                    self.imagesId.push(res.data[i].id);
                }
                var lastId = self.imagesArr[self.imagesArr.length - 1].id;
                if (lastId == 1) {
                    this.morePics = false;
                }

                console.log("imagesId: ", self.imagesId);
            });
        },
        methods: {
            unlike: function(e) {
                for (var i = 0; i < this.imagesArr.length; i++) {
                    if (this.imagesArr[i].id == e.target.id) {
                        this.imagesArr[i].likes -= 1;
                    }
                }
                var totalLikes = e.target.likes + 1;

                e.target.innerText = totalLikes;

                var id = e.target.id;
                axios.post("/unlike", { id }).then(likes => {});
            },
            like: function(e) {
                for (var i = 0; i < this.imagesArr.length; i++) {
                    if (this.imagesArr[i].id == e.target.id) {
                        this.imagesArr[i].likes += 1;
                    }
                }
                var totalLikes = e.target.likes + 1;

                e.target.innerText = totalLikes;

                var id = e.target.id;
                axios.post("/like", { id }).then(likes => {});
            },
            getMoreImages: function() {
                var self = this;

                var lastId = this.imagesArr[this.imagesArr.length - 1].id;
                console.log("ID: ", lastId);
                axios.get("/get-more-images/" + lastId).then(function(res) {
                    self.imagesArr.push.apply(self.imagesArr, res.data);
                    lastId = self.imagesArr[self.imagesArr.length - 1].id;
                    if ((lastId = 1)) {
                        self.morePics = false;
                    }
                    for (var i = 0; i < res.data.length; i++) {
                        self.imagesId.push(res.data[i].id);
                    }
                    console.log("RES DATA1: ", self.imagesId);
                    console.log("last item: ", self.imagesArr[lastId]);
                    //if last id in res is 1 = hide more button
                });
            },
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
                this.form.file = e.target.files[0];
            },
            uploadFile: function(e) {
                var self = this;
                e.preventDefault();
                var formData = new FormData();
                formData.append("file", this.form.file);
                formData.append("title", this.form.title);
                formData.append("description", this.form.description);
                formData.append("username", this.form.username);
                var hash = this.form.hash;
                console.log("is this a string? ", hash);
                console.log(typeof hash);
                var hashArr = hash.split(",");
                axios.post("/upload", formData).then(function(res) {
                    self.imagesArr.unshift(res.data.rows[0]);
                    hashArr.forEach(function(hashInHashArr) {
                        var hashWithoutSpace = hashInHashArr.replace(/\s+/, "");
                        axios
                            .post("/hash", {
                                hashtag: hashWithoutSpace,
                                imgId: res.data.rows[0].id
                            })
                            .then(hashRes => {
                                self.form = {};
                                console.log(hashRes);
                            });
                    });
                });
            }
        }
    });
})();

(function() {
    var inputs = document.querySelectorAll(".input-file");
    Array.prototype.forEach.call(inputs, function(input) {
        var label = input.nextElementSibling,
            labelVal = label.innerHTML;

        input.addEventListener("change", function(e) {
            var fileName = "";
            fileName = e.target.value.split("\\").pop();

            if (fileName) label.querySelector("span").innerHTML = fileName;
            else label.innerHTML = labelVal;
        });
    });
})();
