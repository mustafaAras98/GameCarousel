package com.gamecarousel

import android.media.AudioAttributes
import android.media.SoundPool
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class SoundModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val soundPool: SoundPool
    private val soundMap = HashMap<String, Int>()
    
    init {
        val audioAttributes = AudioAttributes.Builder()
            .setUsage(AudioAttributes.USAGE_GAME)
            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
            .build()
            
        soundPool = SoundPool.Builder()
            .setMaxStreams(5)
            .setAudioAttributes(audioAttributes)
            .build()
    }
    
    override fun getName(): String {
        return "SoundModule"
    }
    
    @ReactMethod
    fun loadSound(soundName: String, resourceName: String) {
        try {
            val resourceId = reactContext.resources.getIdentifier(
                resourceName, "raw", reactContext.packageName
            )
            if (resourceId != 0) {
                val soundId = soundPool.load(reactContext, resourceId, 1)
                soundMap[soundName] = soundId
            }
        } catch (e: Exception) {
            Log.e("SoundModule", "IOException loading sound from: ${e.message}")
        }
    }
    
    @ReactMethod
    fun playSound(soundName: String) {
        val soundId = soundMap[soundName]
        if (soundId != null) {
            soundPool.play(soundId, 1.0f, 1.0f, 1, 0, 1.0f)
        }
    }
    
    @ReactMethod
    fun unloadSound(soundName: String) {
        val soundId = soundMap[soundName]
        if (soundId != null) {
            soundPool.unload(soundId)
            soundMap.remove(soundName)
        }
    }
}