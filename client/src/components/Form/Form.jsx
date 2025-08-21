import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createVideogame, getGenres, getPlatforms } from '../../redux/actions';
import { validate } from './validation';
import './Form.css';


const Form = () => {
    const dispatch = useDispatch();

    const platforms = useSelector((state) => state.platforms);
    const genres = useSelector((state) => state.genres);

    const [form, setForm] = useState({
        name: '',
        description: '',
        released: '',
        rating: '',
        image: '',
        platforms: [],
        genres: [],
    });

    const [errors, setErrors] = useState({});

    const navigate = useNavigate();


    useEffect(() => {
        dispatch(getGenres());
        dispatch(getPlatforms());
    }, [dispatch]);

    useEffect(() => {
        setErrors(validate(form));
    }, [form]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSelectGenre = (e) => {
        const selected = e.target.value;
        if (!form.genres.includes(selected)) {
            setForm({ ...form, genres: [...form.genres, selected] });
        }
    };

    const handleSelectPlatform = (e) => {
        const selected = e.target.value;
        if (!form.platforms.includes(selected)) {
            setForm({ ...form, platforms: [...form.platforms, selected] });
        }
    };

    const handleRemoveGenre = (genreToRemove) => {
        setForm({
            ...form,
            genres: form.genres.filter((g) => g !== genreToRemove),
        });
    };

    const handleRemovePlatform = (platformToRemove) => {
        setForm({
            ...form,
            platforms: form.platforms.filter((p) => p !== platformToRemove),
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const validationErrors = validate(form);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            alert("Por favor corregí los errores antes de continuar");
            return;
        }

        dispatch(createVideogame(form));
        alert("🎉 ¡Videojuego creado con éxito!");

        setForm({
            name: '',
            description: '',
            released: '',
            rating: '',
            image: '',
            platforms: [],
            genres: [],
        });
        setErrors({});
    };


    return (
        <div className="form-container">
            <h2>Crear nuevo videojuego</h2>
            <form onSubmit={handleSubmit}>
                <label>Nombre:</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} />
                {errors.name && <p className="error">{errors.name}</p>}

                <label>Descripción:</label>
                <textarea name="description" value={form.description} onChange={handleChange} />
                {errors.description && <p className="error">{errors.description}</p>}

                <label>Fecha de lanzamiento:</label>
                <input type="date" name="released" value={form.released} onChange={handleChange} />
                {errors.released && <p className="error">{errors.released}</p>}

                <label>Rating (1 a 5):</label>
                <input type="number" name="rating" value={form.rating} onChange={handleChange} min="1" max="5" step="0.1" />
                {errors.rating && <p className="error">{errors.rating}</p>}

                <label>Imagen (URL):</label>
                <input type="text" name="image" value={form.image} onChange={handleChange} />
                {errors.image && <p className="error">{errors.image}</p>}

                <label>Plataformas:</label>
                <select onChange={handleSelectPlatform} defaultValue="">
                    <option value="" disabled>Seleccionar plataforma</option>
                    {platforms.map((p, i) => (
                        <option key={i} value={p}>{p}</option>
                    ))}
                </select>

                <div className="selected-tags">
                    {form.platforms.map((p, i) => (
                        <span key={i} className="tag">
                            {p}
                            <button type="button" onClick={() => handleRemovePlatform(p)}>x</button>
                        </span>
                    ))}
                </div>

                <label>Géneros:</label>
                <select onChange={handleSelectGenre} defaultValue="">
                    <option value="" disabled>Seleccionar género</option>
                    {genres.map((g, i) => (
                        <option key={i} value={g}>{g}</option>
                    ))}
                </select>

                <div className="selected-tags">
                    {form.genres.map((g, i) => (
                        <span key={i} className="tag">
                            {g}
                            <button type="button" onClick={() => handleRemoveGenre(g)}>x</button>
                        </span>
                    ))}
                </div>

                <button type="submit">Crear</button>
                <button type="button" className="back-button" onClick={() => navigate("/home")}
                >
                    ⬅ Volver
                </button>

            </form>
        </div>
    );
};

export default Form;
