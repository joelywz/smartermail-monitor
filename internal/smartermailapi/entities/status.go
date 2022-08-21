package entities

type Status struct {
	Imap         bool
	ImapThreads  int
	Pop          bool
	PopThreads   int
	Uptime       int
	Smtp         bool
	SmtpThreads  int
	Spool        bool
	SpoolCount   int
	SpoolThreads int
}
