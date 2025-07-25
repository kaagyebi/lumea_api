import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "cosmetologist", "admin", "superadmin"],
        default: "user",
    },
    appointments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
        },
    ],
    skinReports: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SkinReport",
        },
    ],
    areaOfExpertise: {
        type: String,
    },
    certificate: {
        type: String, // URL to uploaded certificate
    },
    profile: {
        bio: String,
        specialization: String,
        image: String,
        availability: String,
        certificate: String, // URL to uploaded certificate (for profile display)
        areaOfExpertise: String, // For profile display
    },
}, { timestamps: true });

userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id; }
});

export default mongoose.model("User", userSchema);