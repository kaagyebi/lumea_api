import mongoose from "mongoose";

const skinReportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    imageUrl: {
        type: String,
    },
    analysis: {
        tone: { type: String },
        skinType: { type: String },
        conditions: { type: [String] },
        skinAge: { type: Number },
        skinHealth: { type: String },
        poreVisibility: { type: String },
        texture: { type: String },
        oilLevel: { type: String },
        precautions: { type: [String] },
    },
    cosmetologistNotes: String,
    recommendations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recommendation'
    }], 
}, { timestamps: true });


skinReportSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id; }
});

export default mongoose.model("SkinReport", skinReportSchema);
