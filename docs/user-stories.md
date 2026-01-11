# User Stories - Mini Kanban MVP

## 🎯 MVP Features

### Epic 1: Autentykacja i zarządzanie użytkownikami

**US-001: Rejestracja użytkownika**
- **Jako** nowy użytkownik
- **Chcę** zarejestrować się w systemie przy użyciu emaila i hasła
- **Aby** móc zarządzać swoimi tablicami Kanban

**Kryteria akceptacji:**
- [ ] Formularz zawiera pola: email, hasło, potwierdzenie hasła
- [ ] Email jest walidowany (format, unikalność)
- [ ] Hasło ma min. 8 znaków
- [ ] Po udanej rejestracji użytkownik jest automatycznie zalogowany
- [ ] Wyświetlane są komunikaty błędów walidacji

**US-002: Logowanie użytkownika**
- **Jako** zarejestrowany użytkownik
- **Chcę** zalogować się do systemu
- **Aby** uzyskać dostęp do moich tablic

**Kryteria akceptacji:**
- [ ] Formularz zawiera pola: email, hasło
- [ ] Po udanym logowaniu użytkownik jest przekierowany do listy tablic
- [ ] Wyświetlany jest komunikat błędu przy nieprawidłowych danych
- [ ] Sesja użytkownika jest zachowywana (localStorage/cookies)

**US-003: Wylogowanie**
- **Jako** zalogowany użytkownik
- **Chcę** móc się wylogować
- **Aby** zabezpieczyć swoje dane

**Kryteria akceptacji:**
- [ ] Przycisk wylogowania widoczny w nawigacji
- [ ] Po wylogowaniu użytkownik jest przekierowany do strony logowania
- [ ] Sesja użytkownika jest czyszczona

---

### Epic 2: Zarządzanie tablicami

**US-004: Lista tablic**
- **Jako** zalogowany użytkownik
- **Chcę** widzieć listę moich tablic
- **Aby** móc wybrać tablicę do pracy

**Kryteria akceptacji:**
- [ ] Wyświetlana jest lista wszystkich tablic użytkownika
- [ ] Każda tablica pokazuje nazwę i datę ostatniej modyfikacji
- [ ] Pusty stan z komunikatem gdy użytkownik nie ma tablic
- [ ] Kliknięcie w tablicę otwiera jej widok

**US-005: Tworzenie tablicy**
- **Jako** zalogowany użytkownik
- **Chcę** utworzyć nową tablicę
- **Aby** organizować swoje zadania

**Kryteria akceptacji:**
- [ ] Przycisk "Nowa tablica" widoczny na liście tablic
- [ ] Formularz zawiera pole: nazwa tablicy
- [ ] Nazwa jest wymagana (min. 3 znaki)
- [ ] Po utworzeniu użytkownik jest przekierowany do nowej tablicy
- [ ] Nowa tablica ma domyślnie 3 kolumny: "To Do", "In Progress", "Done"

**US-006: Usuwanie tablicy**
- **Jako** zalogowany użytkownik
- **Chcę** usunąć tablicę
- **Aby** pozbyć się nieaktualnych projektów

**Kryteria akceptacji:**
- [ ] Przycisk usuwania dostępny dla każdej tablicy
- [ ] Wyświetlane jest potwierdzenie przed usunięciem
- [ ] Po usunięciu wszystkie kolumny i karty są również usuwane
- [ ] Użytkownik otrzymuje komunikat o sukcesie

**US-007: Edycja nazwy tablicy**
- **Jako** zalogowany użytkownik
- **Chcę** zmienić nazwę tablicy
- **Aby** lepiej opisać projekt

**Kryteria akceptacji:**
- [ ] Możliwość edycji nazwy poprzez kliknięcie w nią
- [ ] Walidacja jak przy tworzeniu
- [ ] Zmiany są zapisywane automatycznie lub po potwierdzeniu

---

### Epic 3: Zarządzanie kolumnami

**US-008: Tworzenie kolumny**
- **Jako** zalogowany użytkownik
- **Chcę** dodać nową kolumnę do tablicy
- **Aby** dostosować workflow do moich potrzeb

**Kryteria akceptacji:**
- [ ] Przycisk "Dodaj kolumnę" widoczny na tablicy
- [ ] Pole do wpisania nazwy kolumny
- [ ] Nazwa jest wymagana (min. 2 znaki)
- [ ] Kolumna jest dodawana na końcu listy
- [ ] Maksymalnie 10 kolumn na tablicę

**US-009: Usuwanie kolumny**
- **Jako** zalogowany użytkownik
- **Chcę** usunąć kolumnę
- **Aby** uprościć tablicę

**Kryteria akceptacji:**
- [ ] Przycisk usuwania dla każdej kolumny
- [ ] Ostrzeżenie jeśli kolumna zawiera karty
- [ ] Po usunięciu wszystkie karty w kolumnie są również usuwane
- [ ] Nie można usunąć ostatniej kolumny

**US-010: Zmiana nazwy kolumny**
- **Jako** zalogowany użytkownik
- **Chcę** zmienić nazwę kolumny
- **Aby** lepiej opisać etap pracy

**Kryteria akceptacji:**
- [ ] Możliwość edycji nazwy poprzez kliknięcie
- [ ] Walidacja jak przy tworzeniu
- [ ] Zmiany są zapisywane automatycznie

---

### Epic 4: Zarządzanie kartami (zadaniami)

**US-011: Tworzenie karty**
- **Jako** zalogowany użytkownik
- **Chcę** utworzyć nową kartę zadania
- **Aby** śledzić pracę do wykonania

**Kryteria akceptacji:**
- [ ] Przycisk "Dodaj kartę" w każdej kolumnie
- [ ] Formularz zawiera: tytuł (wymagany), opis (opcjonalny), priorytet
- [ ] Tytuł: min. 3 znaki
- [ ] Priorytet: Low, Medium, High
- [ ] Karta jest dodawana na końcu kolumny

**US-012: Edycja karty**
- **Jako** zalogowany użytkownik
- **Chcę** edytować szczegóły karty
- **Aby** aktualizować informacje o zadaniu

**Kryteria akceptacji:**
- [ ] Kliknięcie karty otwiera modal/formularz edycji
- [ ] Możliwość edycji: tytułu, opisu, priorytetu
- [ ] Walidacja jak przy tworzeniu
- [ ] Zmiany są zapisywane
- [ ] Wyświetlana jest data ostatniej modyfikacji

**US-013: Usuwanie karty**
- **Jako** zalogowany użytkownik
- **Chcę** usunąć kartę
- **Aby** pozbyć się nieaktualnych zadań

**Kryteria akceptacji:**
- [ ] Przycisk usuwania w widoku karty
- [ ] Potwierdzenie przed usunięciem
- [ ] Karta jest trwale usuwana z bazy

**US-014: Przenoszenie karty między kolumnami**
- **Jako** zalogowany użytkownik
- **Chcę** przenosić karty między kolumnami
- **Aby** śledzić postęp pracy

**Kryteria akceptacji:**
- [ ] Możliwość przenoszenia przez drag & drop (opcjonalnie w MVP)
- [ ] LUB dropdown do wyboru docelowej kolumny
- [ ] Karta pojawia się na końcu docelowej kolumny
- [ ] Zmiana jest natychmiast widoczna i zapisana

---

### Epic 5: Filtrowanie i wyszukiwanie

**US-015: Filtrowanie po priorytecie**
- **Jako** zalogowany użytkownik
- **Chcę** filtrować karty po priorytecie
- **Aby** skupić się na najważniejszych zadaniach

**Kryteria akceptacji:**
- [ ] Dropdown z opcjami: All, Low, Medium, High
- [ ] Po wybraniu wyświetlane są tylko karty z danym priorytetem
- [ ] Filtr działa na wszystkich kolumnach
- [ ] Stan filtra jest zachowany podczas sesji

**US-016: Wyszukiwanie kart**
- **Jako** zalogowany użytkownik
- **Chcę** wyszukiwać karty po tytule/opisie
- **Aby** szybko znaleźć konkretne zadanie

**Kryteria akceptacji:**
- [ ] Pole wyszukiwania widoczne na tablicy
- [ ] Wyszukiwanie w czasie rzeczywistym (debounce 300ms)
- [ ] Przeszukiwane są tytuł i opis karty
- [ ] Wyświetlane są tylko pasujące karty
- [ ] Możliwość wyczyszczenia wyszukiwania

---

## 🌟 Nice-to-Have Features (Post-MVP)

### US-017: Historia zmian karty
- **Jako** zalogowany użytkownik
- **Chcę** widzieć historię zmian karty
- **Aby** śledzić ewolucję zadania

**Kryteria akceptacji:**
- [ ] Lista zmian z timestampem
- [ ] Informacje o: utworzeniu, edycji, przeniesieniu
- [ ] Dostępna w widoku szczegółów karty

### US-018: Drag & Drop dla kolumn
- **Jako** zalogowany użytkownik
- **Chcę** zmieniać kolejność kolumn
- **Aby** dostosować layout tablicy

### US-019: Etykiety/Tagi
- **Jako** zalogowany użytkownik
- **Chcę** przypisywać tagi do kart
- **Aby** lepiej kategoryzować zadania

### US-020: Współdzielenie tablicy
- **Jako** zalogowany użytkownik
- **Chcę** udostępnić tablicę innym użytkownikom
- **Aby** współpracować nad projektem

### US-021: Deadline dla kart
- **Jako** zalogowany użytkownik
- **Chcę** ustawić termin wykonania
- **Aby** zarządzać czasem

### US-022: Komentarze
- **Jako** zalogowany użytkownik
- **Chcę** dodawać komentarze do kart
- **Aby** komunikować się w kontekście zadania

### US-023: Załączniki
- **Jako** zalogowany użytkownik
- **Chcę** dodawać pliki do kart
- **Aby** przechowywać powiązane dokumenty

### US-024: Powiadomienia
- **Jako** zalogowany użytkownik
- **Chcę** otrzymywać powiadomienia o zmianach
- **Aby** być na bieżąco

### US-025: Dark mode
- **Jako** zalogowany użytkownik
- **Chcę** przełączyć na tryb ciemny
- **Aby** zmniejszyć zmęczenie oczu

### US-026: Export tablicy
- **Jako** zalogowany użytkownik
- **Chcę** eksportować tablicę do JSON/CSV
- **Aby** archiwizować lub przenosić dane

### US-027: Drag & Drop dla kart w kolumnie
- **Jako** zalogowany użytkownik
- **Chcę** zmieniać kolejność kart w kolumnie
- **Aby** priorytetyzować zadania

### US-028: Szablony tablic
- **Jako** zalogowany użytkownik
- **Chcę** tworzyć tablice z szablonów
- **Aby** szybko rozpocząć standardowe projekty

---

## 📊 Metryki sukcesu

### MVP:
- Użytkownik może zarejestrować się i zalogować w < 2 min
- Utworzenie nowej tablicy z pierwszą kartą w < 1 min
- Wszystkie operacje CRUD działają bez błędów
- Responsywny design (mobile + desktop)
- Testy jednostkowe pokrywają min. 70% kodu

### Post-MVP:
- Czas ładowania tablicy < 1s
- Real-time sync między urządzeniami
- Dostępność 99.5%
- Średni czas korzystania > 10 min/sesja
