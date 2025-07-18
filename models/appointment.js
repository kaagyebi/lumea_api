import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }, 
    cosmetologist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    skinType: {
        type: String,
        required: true,
    },
    tone: {
        type: String,
        required: true,
    },
    weight: {
        type: Number,
    },
    height: {
        type: Number,
    },
    hairColor: {
        type: String,
    },
    hairType: {
        type: String,
    },
    description: {
        type: String,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    concern: {
        type: String,
    },
    age: {
        type: Number,
    },
    status: {
        type: String,
        enum: ["accepted", "pending", "completed", "rejected"],
        default: "pending",
    },
    notes: String,
}, { timestamps: true });

appointmentSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id; }
});

export default mongoose.model("Appointment", appointmentSchema);
