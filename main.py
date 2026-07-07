# main.py - Proyecto Integrador: Plataforma de Streaming
# Nombre: Juan Manuel Sanchez Castro
# Matrícula: 2403230435
# Grupo: 06IDPRMA

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


# -----------------------------------------------------------------------
# Instancia de la aplicación
# -----------------------------------------------------------------------
app = FastAPI(title="StreamFlix API", version="1.0.0")

# -----------------------------------------------------------------------
# Configuración de CORS - permite peticiones desde el frontend en Live Server
# -----------------------------------------------------------------------
origins = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:5501",        # ← agrega estas dos líneas
    "http://127.0.0.1:5501",        # ← 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------------------------------------
# Modelo de datos (Programación Orientada a Objetos)
# Representamos cada contenido como una clase para estructurar los datos.
# -----------------------------------------------------------------------
class Pelicula:
    def __init__(self, id: int, titulo: str, genero: str, anio: int,
                 descripcion: str, calificacion: float, imagen: str):
        self.id          = id
        self.titulo      = titulo
        self.genero      = genero
        self.anio        = anio
        self.descripcion = descripcion
        self.calificacion = calificacion
        self.imagen      = imagen

    def to_dict(self):
        return {
            "id":          self.id,
            "titulo":      self.titulo,
            "genero":      self.genero,
            "anio":        self.anio,
            "descripcion": self.descripcion,
            "calificacion": self.calificacion,
            "imagen":      self.imagen,
        }


class Serie:
    def __init__(self, id: int, titulo: str, genero: str, temporadas: int,
                 descripcion: str, calificacion: float, imagen: str):
        self.id          = id
        self.titulo      = titulo
        self.genero      = genero
        self.temporadas  = temporadas
        self.descripcion = descripcion
        self.calificacion = calificacion
        self.imagen      = imagen

    def to_dict(self):
        return {
            "id":           self.id,
            "titulo":       self.titulo,
            "genero":       self.genero,
            "temporadas":   self.temporadas,
            "descripcion":  self.descripcion,
            "calificacion": self.calificacion,
            "imagen":       self.imagen,
        }


# -----------------------------------------------------------------------
# Catálogo de datos estáticos (simulan una base de datos)
# -----------------------------------------------------------------------
catalogo_peliculas = [
    Pelicula(1, "Inception", "Ciencia Ficción", 2010,
             "Un ladrón que roba secretos corporativos a través de los sueños.",
             8.8, "C:/Users/carlo/OneDrive/Desktop/imagen/117580105_p0"),
    Pelicula(2, "The Dark Knight", "Acción", 2008,
             "Batman enfrenta al Joker, un criminal que busca hundir Gotham en el caos.",
             9.0, "https://placehold.co/300x450/1a1a2e/e94560?text=Dark+Knight"),
    Pelicula(3, "Interstellar", "Ciencia Ficción", 2014,
             "Un equipo de exploradores viaja a través de un agujero de gusano en el espacio.",
             8.6, "https://placehold.co/300x450/1a1a2e/e94560?text=Interstellar"),
    Pelicula(4, "The Godfather", "Drama", 1972,
             "El patriarca de una familia de la mafia transfiere el control de su organización a su reacio hijo.",
             9.2, "https://placehold.co/300x450/1a1a2e/e94560?text=Godfather"),
    Pelicula(5, "Pulp Fiction", "Crimen", 1994,
             "Las vidas de dos matones, un boxeador y una esposa de gángster se entrelazan en cuatro historias.",
             8.9, "https://placehold.co/300x450/1a1a2e/e94560?text=Pulp+Fiction"),
    Pelicula(6, "The Matrix", "Ciencia Ficción", 1999,
             "Un hacker descubre la verdad sobre su realidad y su papel en la guerra contra sus controladores.",
             8.7, "https://placehold.co/300x450/1a1a2e/e94560?text=The+Matrix"),
]

catalogo_series = [
    Serie(1, "Breaking Bad", "Drama / Crimen", 5,
          "Un profesor de química se convierte en productor de metanfetaminas.",
          9.5, "https://placehold.co/300x450/16213e/e94560?text=Breaking+Bad"),
    Serie(2, "Stranger Things", "Terror / Sci-Fi", 4,
          "Un grupo de niños enfrenta fuerzas sobrenaturales en su pequeño pueblo.",
          8.7, "https://placehold.co/300x450/16213e/e94560?text=Stranger+Things"),
    Serie(3, "The Crown", "Drama Histórico", 6,
          "La historia de los reinados de la familia real británica desde los años 40.",
          8.6, "https://placehold.co/300x450/16213e/e94560?text=The+Crown"),
    Serie(4, "Chernobyl", "Drama / Historia", 1,
          "La historia del desastre nuclear de Chernóbil en 1986 y sus consecuencias.",
          9.4, "https://placehold.co/300x450/16213e/e94560?text=Chernobyl"),
]


# -----------------------------------------------------------------------
# Endpoints de la API REST
# -----------------------------------------------------------------------

@app.get("/")
def raiz():
    """Ruta raíz: verifica que la API está funcionando."""
    return {"mensaje": "StreamFlix API activa. Visita /docs para la documentación."}


@app.get("/api/peliculas")
def get_peliculas():
    """Devuelve la lista completa de películas en formato JSON."""
    return [p.to_dict() for p in catalogo_peliculas]


@app.get("/api/peliculas/{id}")
def get_pelicula_por_id(id: int):
    """Devuelve una película específica por su ID (parámetro de ruta)."""
    for pelicula in catalogo_peliculas:
        if pelicula.id == id:
            return pelicula.to_dict()
    return {"error": f"Película con id {id} no encontrada."}


@app.get("/api/series")
def get_series():
    """Devuelve la lista completa de series en formato JSON."""
    return [s.to_dict() for s in catalogo_series]


@app.get("/api/catalogo")
def get_catalogo_completo():
    """Devuelve películas y series juntas para el carrusel principal."""
    return {
        "peliculas": [p.to_dict() for p in catalogo_peliculas],
        "series":    [s.to_dict() for s in catalogo_series],
    }