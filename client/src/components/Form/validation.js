// src/components/Form/validation.js
export const validate = (form) => {
    const errors = {};

    if (!form.name.trim()) {
        errors.name = "El nombre es obligatorio";
    }

    if (!form.description.trim()) {
        errors.description = "La descripción es obligatoria";
    }

    if (!form.released) {
        errors.released = "Debes indicar una fecha de lanzamiento";
    }

    if (!form.rating || form.rating < 1 || form.rating > 5) {
        errors.rating = "El rating debe ser entre 1 y 5";
    }

    if (!form.image.trim()) {
        errors.image = "La URL de la imagen es obligatoria";
    } else if (!/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(form.image)) {
        errors.image = "Debe ser una URL válida de imagen";
    }

    if (!form.platforms.length) {
        errors.platforms = "Debes seleccionar al menos una plataforma";
    }

    if (!form.genres.length) {
        errors.genres = "Debes seleccionar al menos un género";
    }

    return errors;
};
