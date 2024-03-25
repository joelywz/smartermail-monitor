package legacy

type Server struct {
	Host     string `json:"host"`
	Username string `json:"username"`
	Password string `json:"password"`
}

type Document struct {
	Servers []Server `json:"servers"`
}
