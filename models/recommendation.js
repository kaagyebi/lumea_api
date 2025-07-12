import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: [String],
    routines: [String],
    notes: String,
    generatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }, 
}, { timestamps: true });

recommendationSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id; }
});

export default mongoose.model("Recommendation", recommendationSchema);
