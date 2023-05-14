# INIA

## APAR y PPNA

### Actualización manual

Executar en este orden los scripts alojados en la cuenta pastizales ROU:


1- apar-ppna-generator (se especifica el año que se quiere generar) --> Esto genera dos ficheros
projects/pastizalesrou/assets/apar/APAR-16_AÑO
projects/pastizalesrou/assets/ppna/PPNA-16_AÑO

(IMPORTANTE: Esperar que la tareas generadas en el paso 1 terminen, verificar que los assets estan disponibles)
2- apar-ppna-update --> Esto genera dos ficheros
projects/pastizalesrou/assets/apar/apar-16_new
projects/pastizalesrou/assets/ppna/ppna-16_new

(IMPORTANTE: Esperar que la tareas generadas en el paso 2 terminen, verificar que los assets estan disponibles)
3- apar-ppna-rename --> Esto hace tres pasos

  3.1- renombra los assets que actulmente estan activos poniendole un sufijo _old
    projects/pastizalesrou/assets/apar/apar-16 --> projects/pastizalesrou/assets/apar/apar-16_old

    projects/pastizalesrou/assets/ppna/ppna-16 --> projects/pastizalesrou/assets/ppna/ppna-16_old

  3.2- renombra los assets con sufijo _new generados en el paso 2:
    projects/pastizalesrou/assets/apar/apar-16_new --> projects/pastizalesrou/assets/apar/apar-16

    projects/pastizalesrou/assets/ppna/ppna-16_new --> projects/pastizalesrou/assets/ppna/ppna-16

  3.3- Comparte en modo lectura los assets resultantes del paso 3.2

  3.4- Elimina los assets con sufijo _old



### Actualización desde el backend

### Sistema automatizado utilizando GCP Scheduler and Composer
