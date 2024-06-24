# Kloniranje projekta i neophodne postavke

- Klonirati repozitorijum komandom https://github.com/elab-development/internet-tehnologije-projekat-aplikacijazazakazivanjesala_2020_0343.git na željenu destinaciju na vašem računaru
- Preuzeti npm sa sledećeg linka https://nodejs.org/en/download
- Pokrenuti MySQL i Apache servere (korišćenjem XAMPP-a)
- U željenom tekstualnom editoru otvoriti klonirani projekat (preporuka VSCode)

# Pokretanje Laravel API-ja

- Pozicionirati se u reservation_backend folder komandom `cd reservation_backend`
- Instalirati composer komandom `composer install`
- Kreirati .env fajl u root-u reservation_backend projekta i podesiti informacije o konekciji sa bazom: DB_PORT, DB_USERNAME, DB_PASSWORD, DB_HOST
- Kreirati šemu baze komandom `php artisan migrate`
- Popuniti bazu podacima komandom `php artisan db:seed`
- Pokrenuti aplikaciju komandom `php artisan serve`

# Pokretanje React aplikacije

- Pozicionirati se u reservation_frontend folder komandom `cd reservation_frontend` (Neophodno je prvo pozicionirati se u root direktorijum komandom `cd ..`)
- Komandom `npm install` ( ili `npm i`), instalirati neophodne pakete za pokretanje same aplikacije
- Pokrenuti aplikaciju komandom `npm start`
