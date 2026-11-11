# 🚀 Cubix Enterprise DevOps CI/CD & Konténerizációs Projekt

Ez a repository egy teljes körű, vállalati szintű **CI/CD (Continuous Integration / Continuous Deployment)** folyamatot és egy biztonságos, **Multi-stage Docker** architektúrát valósít meg. A rendszer célja a kódminőség garantálása, a tesztelés teljes automatizálása, valamint az éles környezet (`master`) szigorú védelme.

---

## 🏗️ 1. A 3-lépcsős Branch Architektúra

A projekt három fő környezeti ágra épül, amelyek szigorú védelmi szabályok (*Branch Protection Rules*) alatt állnak:

```text
[feature/* ág] ──(Pull Request + Jóváhagyás)──► [dev ág] ──(Automata CI/CD Robot)──► [test ág] ──(Kézi Gomb + Production Jóváhagyás)──► [master ág]
```

* **`dev` (Fejlesztői ág):** Az integrációs környezet. Közvetlen feltöltés (*push*) tiltva van. Új kód kizárólag ellenőrzött Pull Requesten keresztül kerülhet be.
* **`test` (Teszt / Staging ág):** A minőségbiztosítási környezet. Kizárólag a GitHub Actions robot frissíti automatikusan, amennyiben a `dev` ágon lefutott a Docker build és a konténerteszt.
* **`master` (Éles / Production ág):** A stabil, éles rendszer forráskódja. Teljesen zárt ág, amelyre kizárólag manuális indítással és dedikált jóváhagyási kapun keresztül kerülhet ki új verzió.

---

## ⚙️ 2. Mi történik a háttérben? (GitHub Actions Automatizáció)

A `.github/workflows/enterprise-pipeline.yml` fájl vezérli a háttérben futó folyamatokat:

1. **Automata Integráció és Tesztelés (`dev` → `test`):**
   * Amikor egy Pull Request beolvad a `dev` ágba, a GitHub Actions automatikusan elindít egy tiszta `ubuntu-latest` virtuális gépet.
   * Felépíti az alkalmazás **Multi-stage Docker Image**-ét (`app/Dockerfile`).
   * Elindít egy tesztkonténert, és ellenőrzi az alkalmazás futását.
   * Sikeres teszt esetén a robot automatikusan összeolvasztja (`merge`) a `dev` ágat a `test` ággal, és feltölti a változásokat.
2. **Kontrollált Élesítés (`test` → `master`):**
   * Ez a folyamat **soha nem indul el magától**. Csak az **Actions** fülön található **Run workflow** gombbal indítható el, egy kötelező kiadási megjegyzés (*release note*) megadásával.
   * Indítás után a folyamat megáll a **`Production` Environment** védelmi kapujánál, és jóváhagyást (*Review deployments*) kér a kijelölt adminisztrátortól.
   * Jóváhagyás után a robot átmásolja a tesztelt kódot a `master` ágra.

---

## 🐳 3. Alkalmazás és Konténerizáció (`app/`)

Az alkalmazás egy pehelykönnyű **Node.js (Express)** szolgáltatás, amely vállalati biztonsági előírásoknak megfelelően van konténerizálva:

* **Multi-stage Build:** A `Dockerfile` különválasztja az építési (*builder*) és a futtatási (*production*) fázist, így a kész konténerbe csak a minimálisan szükséges fájlok kerülnek.
* **Minimális alapkép:** A `node:20-alpine` disztribúció használata minimalizálja a konténer méretét és a biztonsági támadási felületet.
* **Non-root futtatás:** A konténer a `USER node` utasítással, korlátozott jogosultságú felhasználóként fut, megakadályozva a rendszergazdai (*root*) jogosultságokkal való visszaélést.

---

## 👨‍💻 4. Útmutató fejlesztőknek: Hogyan tölts fel új kódot?

A védelmi szabályok miatt **tilos közvetlenül a `dev`, `test` vagy `master` ágakra dolgozni**. Minden módosítást az alábbi lépések szerint kell beküldeni:

### 1. Munkaág létrehozása (GitHub Desktop / Git)
1. Válts át a **`dev`** ágra, és frissítsd a helyi állapotot (**Pull origin**).
2. Hozz létre egy új munkaágat a `dev` ágból kiindulva (pl. `feature/uj-funkcio` vagy `fix/hibajavitas`).

### 2. Fejlesztés és Feltöltés
1. Végezd el a szükséges módosításokat a **VS Code**-ban, majd mentsd el a fájlokat.
2. A **GitHub Desktopban** készíts egy beszédes *Commit*-ot a saját munkaágadra.
3. Kattints a **Publish branch** (vagy *Push origin*) gombra.

### 3. Pull Request és Jóváhagyás
1. Nyiss egy **Pull Requestet** a GitHub felületén:
   * **base:** `dev` ← **compare:** `te-munkaagad`
2. A kódellenőrzés (*Review*) és jóváhagyás után nyomj a **Merge pull request** gombra.
3. Ezt követően a rendszer automatikusan leteszteli a kódodat, és továbbítja a `test` környezetbe.

### 4. Élesítés a `master` ágra (Release Manager feladat)
1. Nyisd meg a GitHubon az **Actions** fület, és válaszd ki az **Enterprise 3-Stage CI/CD Pipeline** folyamatot.
2. Kattints a jobb oldalon található **Run workflow** gombra, írd be a kiadás okát, és indítsd el.
3. A sárga várakozó állapotnál kattints a **Review deployments** gombra, pipáld ki a **`Production`** környezetet, majd kattints az **Approve and deploy** gombra.
