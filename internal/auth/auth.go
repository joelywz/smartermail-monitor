package auth

type Auth struct {
	ID             string `bun:"id,pk"`
	ChallengeValue string `bun:"test_encryption_value,notnull"`
}
