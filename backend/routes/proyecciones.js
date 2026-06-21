const express = require('express');
const router = express.Router();

// POST: Calcular tabla de amortización
router.post('/calcular', (req, res) => {
    const { monto, tasa_anual, plazos } = req.body;

    const P = parseFloat(monto);
    const r = parseFloat(tasa_anual) / 100 / 12; // Tasa de interés mensual
    const n = parseInt(plazos);

    if (!P || !r || !n) {
        return res.status(400).json({ error: 'Faltan datos para el cálculo' });
    }

    // Fórmula de amortización
    const cuota = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    let saldo = P;
    const tabla = [];

    // Generamos el desglose mes a mes
    for (let i = 1; i <= n; i++) {
        const interes = saldo * r;
        const capital = cuota - interes;
        saldo -= capital;
        
        tabla.push({
            mes: i,
            cuota: cuota.toFixed(2),
            interes: interes.toFixed(2),
            capital: capital.toFixed(2),
            saldo: saldo > 0 ? saldo.toFixed(2) : '0.00' // Evitar saldos negativos por redondeo
        });
    }

    res.json({
        cuota_mensual: cuota.toFixed(2),
        total_pagar: (cuota * n).toFixed(2),
        tabla_amortizacion: tabla
    });
});

module.exports = router;