package encrypter_test

import (
	"errors"
	"testing"

	"github.com/joelywz/smartermail-monitor/pkg/encrypter"
)

func TestHash(t *testing.T) {
	b := encrypter.Hash("password")

	if len(b) != 32 {
		t.Errorf("Expected 32 bytes, got %d", len(b))
	}
}

func TestEncryptDecrypt(t *testing.T) {

	msg := "thisIsASecret12345Password"

	encrypted, err := encrypter.Encrypt(msg, "password")

	if err != nil {
		t.Errorf("Expected nil, got %s", err)
	}

	decrypted, err := encrypter.Decrypt(encrypted, "password")

	if err != nil {
		t.Errorf("Expected nil, got %s", err)
	}

	if decrypted != msg {
		t.Errorf("Expected %s, got %s", msg, decrypted)
	}

	_, err = encrypter.Decrypt(encrypted, "wrong-password")

	if !errors.Is(err, encrypter.ErrInvalidPassword) {
		t.Errorf("Expected error, got nil")
	}
}
